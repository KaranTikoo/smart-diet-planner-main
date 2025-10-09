import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Package, Edit, Trash2, Save, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useInventory } from "@/hooks/useInventory";
import { InventoryItem } from "@/lib/supabase";
import { format } from "date-fns";

const Inventory = () => {
  const { items, loading, addItem, updateItem, deleteItem } = useInventory();
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: 1,
    unit: "item",
    category: "other",
    expiration_date: "",
  });
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [isAddingItem, setIsAddingItem] = useState(false);

  const categories = ["produce", "dairy", "meat", "grains", "pantry", "frozen", "other"];
  const units = ["item", "kg", "g", "liter", "ml", "pack", "dozen"];

  const handleAddItem = async () => {
    if (!newItem.name.trim() || newItem.quantity <= 0) {
      toast.error("Please enter a valid name and quantity.");
      return;
    }

    try {
      await addItem({
        name: newItem.name.trim(),
        quantity: newItem.quantity,
        unit: newItem.unit,
        category: newItem.category,
        expiration_date: newItem.expiration_date || null,
      });
      setNewItem({
        name: "",
        quantity: 1,
        unit: "item",
        category: "other",
        expiration_date: "",
      });
      setIsAddingItem(false);
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const handleUpdateItem = async () => {
    if (!editingItem || !editingItem.name.trim() || editingItem.quantity <= 0) {
      toast.error("Please enter a valid name and quantity for the item.");
      return;
    }

    try {
      await updateItem(editingItem.id, {
        name: editingItem.name.trim(),
        quantity: editingItem.quantity,
        unit: editingItem.unit,
        category: editingItem.category,
        expiration_date: editingItem.expiration_date || null,
      });
      setEditingItem(null);
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteItem(id);
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };

  const groupedItems = items.reduce((groups: Record<string, InventoryItem[]>, item) => {
    const category = item.category || "other";
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {});

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
            <p className="text-muted-foreground">
              Manage items you have in stock, bought from your grocery list, etc.
            </p>
          </div>
          <Button className="mt-4 sm:mt-0" onClick={() => setIsAddingItem(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add New Item
          </Button>
        </div>

        {isAddingItem && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="h-5 w-5" /> Add New Inventory Item
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="item-name">Item Name</Label>
                  <Input
                    id="item-name"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    placeholder="e.g., Milk"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="item-quantity">Quantity</Label>
                  <Input
                    id="item-quantity"
                    type="number"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: parseFloat(e.target.value) || 0 })}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="item-unit">Unit</Label>
                  <Select
                    value={newItem.unit}
                    onValueChange={(value) => setNewItem({ ...newItem, unit: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit.charAt(0).toUpperCase() + unit.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="item-category">Category</Label>
                  <Select
                    value={newItem.category}
                    onValueChange={(value) => setNewItem({ ...newItem, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiration-date">Expiration Date</Label>
                  <Input
                    id="expiration-date"
                    type="date"
                    value={newItem.expiration_date}
                    onChange={(e) => setNewItem({ ...newItem, expiration_date: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setIsAddingItem(false)}>
                  <XCircle className="mr-2 h-4 w-4" /> Cancel
                </Button>
                <Button onClick={handleAddItem}>
                  <Plus className="mr-2 h-4 w-4" /> Add Item
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="h-5 w-5" /> Your Current Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading inventory...</div>
            ) : items.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Your inventory is empty. Add some items to get started!
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedItems)
                  .sort(([a], [b]) => categories.indexOf(a) - categories.indexOf(b))
                  .map(([category, categoryItems]) => (
                    <div key={category}>
                      <h3 className="font-semibold text-lg capitalize mb-2">{category}</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead className="w-[100px]">Quantity</TableHead>
                            <TableHead className="w-[120px]">Expires</TableHead>
                            <TableHead className="text-right w-[120px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {categoryItems.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">
                                {editingItem?.id === item.id ? (
                                  <Input
                                    value={editingItem.name}
                                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                                    className="h-8"
                                  />
                                ) : (
                                  item.name
                                )}
                              </TableCell>
                              <TableCell>
                                {editingItem?.id === item.id ? (
                                  <div className="flex items-center gap-1">
                                    <Input
                                      type="number"
                                      value={editingItem.quantity}
                                      onChange={(e) => setEditingItem({ ...editingItem, quantity: parseFloat(e.target.value) || 0 })}
                                      className="h-8 w-20"
                                      min="0"
                                    />
                                    <Select
                                      value={editingItem.unit || "item"}
                                      onValueChange={(value) => setEditingItem({ ...editingItem, unit: value })}
                                    >
                                      <SelectTrigger className="h-8 w-20 text-xs">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {units.map((unit) => (
                                          <SelectItem key={unit} value={unit}>
                                            {unit}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                ) : (
                                  `${item.quantity} ${item.unit || "item"}`
                                )}
                              </TableCell>
                              <TableCell>
                                {editingItem?.id === item.id ? (
                                  <Input
                                    type="date"
                                    value={editingItem.expiration_date || ""}
                                    onChange={(e) => setEditingItem({ ...editingItem, expiration_date: e.target.value })}
                                    className="h-8"
                                  />
                                ) : (
                                  item.expiration_date ? format(new Date(item.expiration_date), 'MMM dd, yyyy') : 'N/A'
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                {editingItem?.id === item.id ? (
                                  <div className="flex justify-end gap-1">
                                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleUpdateItem}>
                                      <Save className="h-4 w-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground" onClick={() => setEditingItem(null)}>
                                      <XCircle className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="flex justify-end gap-1">
                                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setEditingItem(item)}>
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => handleDeleteItem(item.id)}>
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Inventory;