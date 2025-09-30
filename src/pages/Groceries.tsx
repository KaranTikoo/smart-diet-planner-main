
import { useState } from "react";
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
} from "lucide-react";
import { toast } from "sonner";

interface GroceryItem {
  id: string;
  name: string;
  category: string;
  checked: boolean;
}

const Groceries = () => {
  const [items, setItems] = useState<GroceryItem[]>([
    { id: "1", name: "Chicken breast", category: "protein", checked: false },
    { id: "2", name: "Spinach", category: "vegetables", checked: false },
    { id: "3", name: "Greek yogurt", category: "dairy", checked: false },
    { id: "4", name: "Brown rice", category: "grains", checked: false },
    { id: "5", name: "Apples", category: "fruits", checked: false },
    { id: "6", name: "Quinoa", category: "grains", checked: false },
    { id: "7", name: "Salmon fillets", category: "protein", checked: false },
    { id: "8", name: "Broccoli", category: "vegetables", checked: false },
    { id: "9", name: "Avocados", category: "fruits", checked: false },
    { id: "10", name: "Almond milk", category: "dairy", checked: false },
    { id: "11", name: "Sweet potatoes", category: "vegetables", checked: false },
    { id: "12", name: "Eggs", category: "protein", checked: false },
  ]);
  
  const [newItemInput, setNewItemInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingItemText, setEditingItemText] = useState("");

  const categories = ["protein", "fruits", "vegetables", "grains", "dairy", "other"];
  
  const groupedItems = items.reduce((groups: Record<string, GroceryItem[]>, item) => {
    const category = item.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {});

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemInput.trim()) {
      const newItem = {
        id: Date.now().toString(),
        name: newItemInput.trim(),
        category: "other",
        checked: false,
      };
      setItems([...items, newItem]);
      setNewItemInput("");
      toast.success("Item added to grocery list");
    }
  };

  const handleToggleItem = (id: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
    toast.success("Item removed from grocery list");
  };

  const handleEditStart = (item: GroceryItem) => {
    setEditingItemId(item.id);
    setEditingItemText(item.name);
  };

  const handleEditSave = () => {
    if (editingItemId && editingItemText.trim()) {
      setItems(
        items.map((item) =>
          item.id === editingItemId ? { ...item, name: editingItemText.trim() } : item
        )
      );
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

  const handleCategoryChange = (id: string, category: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, category } : item
      )
    );
  };

  const handleClearCompleted = () => {
    const completedItems = items.filter((item) => item.checked);
    if (completedItems.length === 0) {
      toast.info("No completed items to clear");
      return;
    }
    
    setItems(items.filter((item) => !item.checked));
    toast.success(`Removed ${completedItems.length} completed items`);
  };

  const handleGenerateList = () => {
    setIsGenerating(true);
    
    // Simulate generating a new grocery list
    setTimeout(() => {
      const newItems = [
        { id: "13", name: "Ground turkey", category: "protein", checked: false },
        { id: "14", name: "Bell peppers", category: "vegetables", checked: false },
        { id: "15", name: "Bananas", category: "fruits", checked: false },
        { id: "16", name: "Oats", category: "grains", checked: false },
        { id: "17", name: "Cottage cheese", category: "dairy", checked: false },
      ];
      
      setItems([...items.filter((item) => item.checked), ...newItems]);
      setIsGenerating(false);
      toast.success("New grocery list generated based on your meal plan");
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
              disabled={isGenerating}
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
                  />
                  <Button type="submit" size="icon">
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
                          if (!items.some((i) => i.name.toLowerCase() === item.toLowerCase())) {
                            const newItem = {
                              id: Date.now().toString(),
                              name: item,
                              category: item === "Eggs" || item === "Chicken" ? "protein" 
                                      : item === "Milk" ? "dairy"
                                      : item === "Bread" || item === "Rice" ? "grains"
                                      : item === "Apples" || item === "Bananas" ? "fruits"
                                      : "vegetables",
                              checked: false,
                            };
                            setItems([...items, newItem]);
                            toast.success(`Added ${item} to grocery list`);
                          } else {
                            toast.info(`${item} is already on your list`);
                          }
                        }}
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
              >
                <Trash2 className="mr-2 h-4 w-4" /> Clear Completed
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.keys(groupedItems).length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Your grocery list is empty</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Add items or generate a list from your meal plan
                    </p>
                  </div>
                ) : (
                  Object.entries(groupedItems)
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
                                item.checked ? "bg-muted/50" : "bg-card"
                              }`}
                            >
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`item-${item.id}`}
                                  checked={item.checked}
                                  onCheckedChange={() => handleToggleItem(item.id)}
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
                                      item.checked ? "line-through text-muted-foreground" : ""
                                    }`}
                                  >
                                    {item.name}
                                  </Label>
                                )}
                              </div>
                              {editingItemId !== item.id && (
                                <div className="flex items-center space-x-1">
                                  <select
                                    value={item.category}
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
                                    <i className="h-4 w-4">✏️</i>
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
                )}
                
                <div className="pt-4 flex justify-between text-sm text-muted-foreground">
                  <span>
                    {items.filter((item) => !item.checked).length} items remaining
                  </span>
                  <span>
                    {items.filter((item) => item.checked).length} completed
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
