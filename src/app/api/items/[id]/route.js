import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// GET: Hämta ett specifikt item baserat på ID
export async function GET(req, { params }) {
  try {
    const { id } = params;

    const item = await prisma.item.findUnique({
      where: { id: Number(id) },
    });

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 400 });
    }

    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to retrive item" },
      { status: 500 }
    );
  }
}

// PUT: Uppdatera ett specifikt item
// export async function PUT(req, { params }) {
//   try {
//     const body = await req.json();
//     const { name, description, quantity, category } = body;
//     const { id } = params;

//     // Kontrollera att åtminstonde ett fält är ifyllt
//     if (!id || (!name && !description && !quantity && !category)) {
//       return NextResponse.json(
//         { error: "Invalid input data" },
//         { status: 400 }
//       );
//     }

//     const updatedItem = await prisma.item.update({
//       where: { id: Number(id) }, // Viktigt att säkerställa att id är en siffra
//       data: {
//         name,
//         description,
//         quantity,
//         category,
//       },
//     });

//     return NextResponse.json(updatedItem);
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to update item" },
//       { status: 500 }
//     );
//   }
// }

export async function PUT(req, { params }) {
  const token = req.headers.get("Authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 });
  }

  try {
    // Verifiera JWT-token
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("Decoded token:", decoded); // För felsökning

    const { id } = params;
    const body = await req.json();
    const { name, description, quantity, category } = body;

    if (!id || (!name && !description && !quantity && !category)) {
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 }
      );
    }

    // Bygg dataobjektet för uppdatering
    const data = {};
    if (name) data.name = name;
    if (description) data.description = description;
    if (quantity) data.quantity = Number(quantity);
    if (category) data.category = category;

    // Uppdatera item i databasen
    const updatedItem = await prisma.item.update({
      where: { id: Number(id) },
      data,
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("Error in PUT /api/items/[id]:", error);
    return NextResponse.json(
      { error: "Failed to update item" },
      { status: 500 }
    );
  }
}

// DELETE: Ta bort ett specifikt item
// export async function DELETE(req, { params }) {
//   try {
//     const { id } = params;

//     // Kontrollera att ID är tillgängligt
//     if (!id) {
//       return NextResponse.json({ error: "ID is required" }, { status: 400 });
//     }

//     // Ta bort från databasen
//     await prisma.item.delete({
//       where: { id: Number(id) },
//     });

//     return NextResponse.json(
//       { message: `Item with ID ${id} was deleted successfully` },
//       { status: 200 }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to delete item" },
//       { status: 500 }
//     );
//   }
// }

// DELETE: Ta bort ett specifikt item
// export async function DELETE(req, { params }) {
//   try {
//     // Verifiera JWT-token
//     const authHeader = req.headers.get("authorization");
//     if (!authHeader) {
//       return NextResponse.json(
//         { error: "Authorization header missing" },
//         { status: 401 }
//       );
//     }

//     const token = authHeader.split(" ")[1]; // Bearer token
//     try {
//       jwt.verify(token, JWT_SECRET);
//     } catch (error) {
//       return NextResponse.json({ error: "Invalid token" }, { status: 401 });
//     }

//     const { id } = params;

//     // Kontrollera att ID är tillgängligt
//     if (!id) {
//       return NextResponse.json({ error: "ID is required" }, { status: 400 });
//     }

//     // Ta bort från databasen
//     await prisma.item.delete({
//       where: { id: Number(id) },
//     });

//     return NextResponse.json(
//       { message: `Item with ID ${id} was deleted successfully` },
//       { status: 200 }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to delete item" },
//       { status: 500 }
//     );
//   }
// }

// DELETE: Ta bort ett specifikt item
export async function DELETE(req, { params }) {
  const token = req.headers.get("Authorization")?.split(" ")[1]; // Hämta token från headern

  if (!token) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // Verifiera token
    const { id } = params;

    await prisma.item.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(
      { message: "Item deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error); // Logga felet för felsökning
    return NextResponse.json(
      { error: "Unauthorized or failed to delete item" },
      { status: 401 }
    );
  }
}
