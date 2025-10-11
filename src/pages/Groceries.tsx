import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingBasket,
  Plus,
  RefreshCw,
  Printer,
  Share2,
  Mail,
  Trash2,
  ArrowRight,
  Check,
  X,
  Edit, // Ensure Edit icon is imported
} from "lucide-react";
import { toast } from "sonner";
import { useInventory } from "@/hooks/useInventory";
import { useGroceryLists } from "@/hooks/useGroceryLists"; // Import useGroceryLists hook
import { GroceryItem as SupabaseGroceryItem } from "@/lib/supabase"; // Import Supabase GroceryItem type
import { mockFoodDatabase } from "@/data/mockFoodDatabase"; // For generating items from meal plan

const Groceries = () => {
  const { addItem: addInventoryItem } = useInventory();
  const {
    groceryLists,
    selectedListId,
    setSelectedListId,
    items,
    loading,
    error,
    fetchGroceryLists,
    fetchGroceryItems,
    addGroceryList,
    addGroceryItem,
    updateGroceryItem,
    deleteGroceryItem,
    clearCompletedItems,
  } = useGroceryLists();

  const [newItemInput, setNewItemInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingItemText, setEditingItemText] = useState("");

  const categories = ["protein", "fruits", "vegetables", "grains", "dairy", "other"];

  // Ensure a default list exists if none are present for the user
  useEffect(() => {
    if (!loading && groceryLists.length === 0 && !selectedListId) {
      addGroceryList("My Grocery List");
    }
  }, [loading, groceryLists, selectedListId, addGroceryList]);

  const groupedItems = items.reduce((groups: Record<string, SupabaseGroceryItem[]>, item) => {
    const category = item.category || "other";
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {});

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemInput.trim() && selectedListId) {
      await addGroceryItem({
        name: newItemInput.trim(),
        category: "other", // Default category
        quantity: 1, // Default quantity
        unit: "item", // Default unit
        is_checked: false,
      });
      setNewItemInput("");
    } else if (!selectedListId) {
      toast.error("No grocery list selected. Please create one first.");
    }
  };

  const handleQuickAddItem = async (itemName: string, itemCategory: string) => {
    if (selectedListId) {
      const existingItem = items.find((i) => i.name.toLowerCase() === itemName.toLowerCase());
      if (existingItem) {
        toast.info(`${itemName} is already on your list`);
      } else {
        await addGroceryItem({
          name: itemName,
          category: itemCategory,
          quantity: 1,
          unit: "item",
          is_checked: false,
        });
      }
    } else {
      toast.error("No grocery list selected. Please create one first.");
    }
  };

  const handleToggleItem = async (item: SupabaseGroceryItem) => {
    if (!selectedListId) return;

    // Optimistically update UI
    setItems(prevItems => prevItems.map(i => i.id === item.id ? { ...i, is_checked: !i.is_checked } : i));

    try {
      await updateGroceryItem(item.id, { is_checked: !item.is_checked });

      // If item is checked, add to inventory
      if (!item.is_checked) { // If it was unchecked and now checked
        await addInventoryItem({
          name: item.name,
          quantity: item.quantity || 1,
          unit: item.unit || "item",
          category: item.category || "other",
          expiration_date: null,
        });
        toast.success(`'${item.name}' bought and added to your inventory!`);
      }
    } catch (error) {
      console.error("Failed to update item or add to inventory:", error);
      toast.error(`Failed to process '${item.name}'. Please try again.`);
      // Revert optimistic update if API call fails
      setItems(prevItems => prevItems.map(i => i.id === item.id ? { ...i, is_checked: item.is_checked } : i));
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      await deleteGroceryItem(id);
    }
  };

  const handleEditStart = (item: SupabaseGroceryItem) => {
    setEditingItemId(item.id);
    setEditingItemText(item.name);
  };

  const handleEditSave = async () => {
    if (editingItemId && editingItemText.trim()) {
      await updateGroceryItem(editingItemId, { name: editingItemText.trim() });
      setEditingItemId(null);
      setEditingItemText("");
    }
  };

  const handleEditCancel = () => {
    setEditingItemId(null);
    setEditingItemText("");
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleEditSave();
    } else if (e.key === "Escape") {
      handleEditCancel();
    }
  };

  const handleCategoryChange = async (id: string, category: string) => {
    await updateGroceryItem(id, { category });
  };

  const handleClearCompleted = async () => {
    await clearCompletedItems();
  };

  const handleGenerateList = async () => {
    setIsGenerating(true);
    if (!selectedListId) {
      toast.error("No grocery list selected. Please create one first.");
      setIsGenerating(false);
      return;
    }

    // Simulate generating a new grocery list from meal plan
    setTimeout(async () => {
      const newItemsToAdd = [
        { name: "Ground turkey", category: "protein", quantity: 1, unit: "pack" },
        { name: "Bell peppers", category: "vegetables", quantity: 3, unit: "item" },
        { name: "Bananas", category: "fruits", quantity: 1, unit: "bunch" },
        { name: "Oats", category: "grains", quantity: 1, unit: "box" },
        { name: "Cottage cheese", category: "dairy", quantity: 1, unit: "container" },
      ];

      for (const item of newItemsToAdd) {
        const existingItem = items.find((i) => i.name.toLowerCase() === item.name.toLowerCase());
        if (!existingItem) {
          await addGroceryItem({
            grocery_list_id: selectedListId,
            name: item.name,
            category: item.category,
            quantity: item.quantity,
            unit: item.unit,
            is_checked: false,
          });
        }
      }
      setIsGenerating(false);
      toast.success("New grocery list generated based on your meal plan");
      fetchGroceryItems(selectedListId); // Refetch to ensure all new items are displayed
    }, 1500);
  };

  const handlePrintList = () => {
    toast.info("Preparing grocery list for printing...");
    // This would typically trigger a print dialog
  };

  const handleShareList = () => {
    toast.info("Share functionality coming soon");
  };

  const handleEmailList = () => {
    toast.info("Email functionality coming soon");
  };

  if (loading && groceryLists.length === 0 && !selectedListId) {
    return (
      <MainLayout>
        <div className="text-center py-12 text-muted-foreground">Loading items...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Grocery List</h1>
            <p className="text-muted-foreground">
              Manage your shopping list for your meal plan
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateList}
              disabled={isGenerating || !selectedListId}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" /> Generate from Meal Plan
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrintList}>
              <Printer className="mr-2 h-4 w-4" /> Print
            </Button>
            <Button variant="outline" size="sm" onClick={handleShareList}>
              <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Item Form */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="h-5 w-5" /> Add Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddItem} className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    value={newItemInput}
                    onChange={(e) => setNewItemInput(e.target.value)}
                    placeholder="Add a new item..."
                    disabled={!selectedListId}
                  />
                  <Button type="submit" size="icon" disabled={!selectedListId}>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="pt-4 space-y-3">
                  <h3 className="font-medium">Quick Add Common Items</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {["Eggs", "Milk", "Bread", "Chicken", "Rice", "Apples", "Bananas", "Spinach"].map((item) => (
                      <Button
                        key={item}
                        variant="outline"
                        size="sm"
                        className="justify-start"
                        onClick={() => {
                          const category = item === "Eggs" || item === "Chicken" ? "protein"
                                      : item === "Milk" ? "dairy"
                                      : item === "Bread" || item === "Rice" ? "grains"
                                      : item === "Apples" || item === "Bananas" ? "fruits"
                                      : "vegetables";
                          handleQuickAddItem(item, category);
                        }}
                        disabled={!selectedListId}
                      >
                        <Plus className="mr-2 h-3 w-3" /> {item}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full text-muted-foreground"
                    onClick={handleEmailList}
                    disabled={!selectedListId}
                  >
                    <Mail className="mr-2 h-4 w-4" /> Email me this list
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Grocery List */}
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <ShoppingBasket className="h-5 w-5" /> Your Grocery List
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-muted-foreground"
                onClick={handleClearCompleted}
                disabled={!selectedListId || items.filter(item => item.is_checked).length === 0}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Clear Completed
              </Button>
            </CardHeader>
            <CardContent>
              {loading && items.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">Loading items...</div>
              ) : items.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Your grocery list is empty</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Add items or generate a list from your meal plan
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(groupedItems)
                    .sort(([a], [b]) => {
                      const categoryOrder = categories;
                      return categoryOrder.indexOf(a) - categoryOrder.indexOf(b);
                    })
                    .map(([category, categoryItems]) => (
                      <div key={category}>
                        <div className="flex items-center mb-2">
                          <h3 className="font-medium capitalize">{category}</h3>
                          <Badge variant="outline" className="ml-2">
                            {categoryItems.length}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          {categoryItems.map((item) => (
                            <div
                              key={item.id}
                              className={`flex items-center justify-between p-2 rounded-md ${
                                item.is_checked ? "bg-muted/50" : "bg-card"
                              }`}
                            >
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`item-${item.id}`}
                                  checked={item.is_checked || false}
                                  onCheckedChange={() => handleToggleItem(item)}
                                />
                                {editingItemId === item.id ? (
                                  <div className="flex items-center space-x-2">
                                    <Input
                                      value={editingItemText}
                                      onChange={(e) => setEditingItemText(e.target.value)}
                                      onKeyDown={handleEditKeyDown}
                                      className="h-8 w-40"
                                      autoFocus
                                    />
                                    <Button
                                      type="button"
                                      size="icon"
                                      variant="ghost"
                                      className="h-8 w-8"
                                      onClick={handleEditSave}
                                    >
                                      <Check className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      type="button"
                                      size="icon"
                                      variant="ghost"
                                      className="h-8 w-8"
                                      onClick={handleEditCancel}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ) : (
                                  <Label
                                    htmlFor={`item-${item.id}`}
                                    className={`${
                                      item.is_checked ? "line-through text-muted-foreground" : ""
                                    }`}
                                  >
                                    {item.name}
                                  </Label>
                                )}
                              </div>
                              {editingItemId !== item.id && (
                                <div className="flex items-center space-x-1">
                                  <select
                                    value={item.category || "other"}
                                    onChange={(e) => handleCategoryChange(item.id, e.target.value)}
                                    className="h-8 px-2 text-xs rounded border border-input bg-background"
                                  >
                                    {categories.map((cat) => (
                                      <option key={cat} value={cat}>
                                        {cat}
                                      </option>
                                    ))}
                                  </select>
                                  <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8"
                                    onClick={() => handleEditStart(item)}
                                  >
                                    <Edit className="h-4 w-4" /> {/* Replaced <i> with Edit component */}
                                  </Button>
                                  <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 text-destructive"
                                    onClick={() => handleDeleteItem(item.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                }
                </div> {/* This closing div was missing, causing the error */}

                <div className="pt-4 flex justify-between text-sm text-muted-foreground">
                  <span>
                    {items.filter((item) => !item.is_checked).length} items remaining
                  </span>
                  <span>
                    {items.filter((item) => item.is_checked).length} completed
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Groceries;