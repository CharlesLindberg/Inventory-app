"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [newItem, setNewItem] = useState({
    id: "",
    name: "",
    description: "",
    quantity: "",
    category: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  // Kontrollera om användaren är inloggad
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setIsLoggedIn(true);
      fetchItems();
    }
  }, []);

  // Hämta items från API
  const fetchItems = async () => {
    try {
      const res = await fetch("/api/items");
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch items");
      }
      setItems(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Hantera ändringar i formuläret
  const handleInputChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  // Lägg till nytt item
  const addItem = async () => {
    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItem),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to add item");
      }
      fetchItems(); // Uppdatera items efter tillägg
      setNewItem({ name: "", description: "", quantity: "", category: "" });
    } catch (err) {
      setError(err.message);
    }
  };

  // Ta bort ett item
  //   const deleteItem = async (id) => {
  //     try {
  //       const res = await fetch(`/api/items/${id}`, {
  //         method: "DELETE",
  //       });
  //       if (!res.ok) {
  //         throw new Error("Failed to delete item");
  //       }
  //       fetchItems(); // Uppdatera listan efter borttagning
  //     } catch (err) {
  //       setError(err.message);
  //     }
  //   };
  const deleteItem = async (id) => {
    const token = localStorage.getItem("token"); // Hämta token från localStorage
    console.log("Token:", token); // Kontrollera om token hämtas korrekt

    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    try {
      const res = await fetch(`/api/items/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // Skicka token i headern
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete item");
      }

      setItems(items.filter((item) => item.id !== id)); // Uppdatera listan efter radering
    } catch (err) {
      setError(err.message); // Hantera felmeddelanden
    }
  };

  // Ladda item för redigering
  const loadItemForEdit = (item) => {
    setNewItem(item);
    setIsEditing(true);
  };

  // Uppdatera item
  const updateItem = async () => {
    try {
      const res = await fetch(`/api/items/${newItem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItem),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update item");
      }
      setIsEditing(false);
      fetchItems(); // Uppdatera listan efter uppdatering
      setNewItem({ name: "", description: "", quantity: "", category: "" });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {isLoggedIn ? (
        <div>
          <h2>{isEditing ? "Edit Item" : "Add New Item"}</h2>
          <input
            type="text"
            name="name"
            placeholder="Item Name"
            value={newItem.name}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="description"
            placeholder="Item Description"
            value={newItem.description}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={newItem.quantity}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={newItem.category}
            onChange={handleInputChange}
          />
          <button onClick={isEditing ? updateItem : addItem}>
            {isEditing ? "Update Item" : "Add Item"}
          </button>

          <h2>Items List</h2>
          {items.length === 0 ? (
            <p>No items found.</p>
          ) : (
            <ul>
              {items.map((item) => (
                <li key={item.id}>
                  <strong>{item.name}</strong>: {item.description} -{" "}
                  {item.quantity} in stock
                  <button onClick={() => loadItemForEdit(item)}>Edit</button>
                  <button onClick={() => deleteItem(item.id)}>Delete</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
