// "use client";

// import { useState, useEffect } from "react";

// export default function ItemList() {
//   const [items, setItems] = useState([]);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchItems = async () => {
//       try {
//         const res = await fetch("/api/items");
//         const data = await res.json();

//         if (!res.ok) {
//           throw new Error(data.error || "Failed to fetch items");
//         }

//         setItems(data);
//       } catch (err) {
//         setError(err.message);
//       }
//     };

//     fetchItems();
//   }, []);

//   return (
//     <div>
//       <h1>Items List</h1>
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       {items.length === 0 ? (
//         <p>No items found.</p>
//       ) : (
//         <ul>
//           {items.map((item) => (
//             <li key={item.id}>
//               <strong>{item.name}</strong>: {item.description} - {item.quantity}{" "}
//               in stock
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect } from "react";

// export default function ItemList() {
//   const [items, setItems] = useState([]);
//   const [error, setError] = useState(null);
//   const [editingItem, setEditingItem] = useState(null); // Lagrar vilket item som redigeras
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     quantity: "",
//     category: "",
//   });

//   useEffect(() => {
//     const fetchItems = async () => {
//       try {
//         const res = await fetch("/api/items");
//         const data = await res.json();

//         if (!res.ok) {
//           throw new Error(data.error || "Failed to fetch items");
//         }

//         setItems(data);
//       } catch (err) {
//         setError(err.message);
//       }
//     };

//     fetchItems();
//   }, []);

//   // Funktion för att ta bort ett item
//   const handleDelete = async (id) => {
//     const token = localStorage.getItem("token"); // Hämta token från localStorage
//     if (!token) {
//       setError("No token found. Please log in.");
//       return;
//     }

//     try {
//       const res = await fetch(`/api/items/${id}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`, // Skicka token i headern
//         },
//       });

//       if (!res.ok) {
//         throw new Error("Failed to delete item");
//       }

//       setItems(items.filter((item) => item.id !== id));
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   // Funktion för att öppna redigeringsformuläret
//   const handleEdit = (item) => {
//     setEditingItem(item);
//     setFormData({
//       name: item.name,
//       description: item.description,
//       quantity: item.quantity,
//       category: item.category,
//     });
//   };

//   // Hantera formulärändringar
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Skicka PUT-förfrågan för att uppdatera itemet
//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await fetch(`/api/items/${editingItem.id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });

//       if (!res.ok) {
//         throw new Error("Failed to update item");
//       }

//       const updatedItem = await res.json();

//       setItems(
//         items.map((item) => (item.id === editingItem.id ? updatedItem : item))
//       );

//       setEditingItem(null); // Stäng formuläret efter att uppdateringen lyckades
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div className="container">
//       <h1>Items List</h1>
//       {error && <p className="error-message">{error}</p>}
//       {items.length === 0 ? (
//         <p>No items found.</p>
//       ) : (
//         <ul>
//           {items.map((item) => (
//             <li key={item.id}>
//               <div>
//                 <strong>{item.name}</strong>: {item.description} -{" "}
//                 {item.quantity} in stock
//               </div>
//               <div className="item-actions">
//                 <button onClick={() => handleEdit(item)}>Edit</button>
//                 <button onClick={() => handleDelete(item.id)}>Delete</button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}

//       {/* Redigeringsformulär */}
//       {editingItem && (
//         <form onSubmit={handleUpdate} className="edit-form">
//           <h2>Editing {editingItem.name}</h2>
//           <input
//             type="text"
//             name="name"
//             placeholder="Name"
//             value={formData.name}
//             onChange={handleChange}
//           />
//           <input
//             type="text"
//             name="description"
//             placeholder="Description"
//             value={formData.description}
//             onChange={handleChange}
//           />
//           <input
//             type="number"
//             name="quantity"
//             placeholder="Quantity"
//             value={formData.quantity}
//             onChange={handleChange}
//           />
//           <input
//             type="text"
//             name="category"
//             placeholder="Category"
//             value={formData.category}
//             onChange={handleChange}
//           />
//           <button type="submit">Update</button>
//         </form>
//       )}
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";

export default function ItemList() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [editingItem, setEditingItem] = useState(null); // Currently editing item
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: "",
    category: "",
  });
  const [newItemData, setNewItemData] = useState({
    name: "",
    description: "",
    quantity: "",
    category: "",
  });

  useEffect(() => {
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

    fetchItems();
  }, []);

  // Function to delete an item
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    try {
      const res = await fetch(`/api/items/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // Include token in headers
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete item");
      }

      setItems(items.filter((item) => item.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  // Function to open the edit form
  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      quantity: item.quantity,
      category: item.category,
    });
  };

  // Handle changes in the edit form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle changes in the add new item form
  const handleNewItemChange = (e) => {
    setNewItemData({ ...newItemData, [e.target.name]: e.target.value });
  };

  // Submit the update for an item
  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); // Retrieve token from localStorage
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    try {
      const res = await fetch(`/api/items/${editingItem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token in headers
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to update item");
      }

      const updatedItem = await res.json();

      setItems(
        items.map((item) => (item.id === editingItem.id ? updatedItem : item))
      );

      setEditingItem(null); // Close the form after successful update
    } catch (err) {
      setError(err.message);
    }
  };

  // Function to add a new item
  const handleAddItem = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); // Retrieve token from localStorage
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    console.log("New item data: ", newItemData);

    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token in headers
        },
        body: JSON.stringify(newItemData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to add item");
      }

      // Add the new item to the items list
      setItems([...items, data]);

      // Clear the new item form
      setNewItemData({
        name: "",
        description: "",
        quantity: "",
        category: "",
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <h1>Items List</h1>
      {error && <p className="error-message">{error}</p>}

      {/* Add New Item Form */}
      <h2>Add New Item</h2>
      <form onSubmit={handleAddItem} className="add-item-form">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newItemData.name}
          onChange={handleNewItemChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={newItemData.description}
          onChange={handleNewItemChange}
          required
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={newItemData.quantity}
          onChange={handleNewItemChange}
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={newItemData.category}
          onChange={handleNewItemChange}
          required
        />
        <button type="submit">Add Item</button>
      </form>

      {/* Items List */}
      {items.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <div>
                <strong>{item.name}</strong>: {item.description} -{" "}
                {item.quantity} in stock
              </div>
              <div className="item-actions">
                <button onClick={() => handleEdit(item)}>Edit</button>
                <button onClick={() => handleDelete(item.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Edit Item Form */}
      {editingItem && (
        <form onSubmit={handleUpdate} className="edit-form">
          <h2>Editing {editingItem.name}</h2>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            required
          />
          <button type="submit">Update</button>
          <button type="button" onClick={() => setEditingItem(null)}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}
