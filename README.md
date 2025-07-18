# ZondaDemo

A full-stack product management application built with .NET Core backend and Next.js frontend, featuring customer and product management capabilities.

## 🚀 Features

- Product Management
  - View, create, update, and delete products
  - Searchable product table with sorting and filtering
  - Fixed table layout with sticky headers and proper column alignment
  - Real-time stock and price updates
  
- Customer Management
  - View customer details and their associated products
  - Add/remove products from customer accounts
  - Searchable customer selector with sticky search box
  
- Data Persistence
  - RTK Query integration with 1-hour cache duration
  - Cache persistence across page reloads
  - Automatic cache invalidation on data mutations

## 🛠️ Prerequisites

- Node.js (v18 or higher)
- .NET 8.0 SDK

## 📦 Installation

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd ZondaDemo/backend/ZondaDemo
   ```

2. Run the backend:
   ```bash
   dotnet run --project ZondaDemo.API
   ```

The API will be available at `https://localhost:7214` by default. The application uses an in-memory database that is automatically seeded with sample data on startup, so no additional database setup is required.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ZondaDemo/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`.

## 💻 Usage Guide

### Product Management

1. **View Products**
   - Navigate to the Products page
   - Use the search bar to filter products
   - Sort by clicking column headers
   - Scroll through the fixed-height table with sticky headers

2. **Add New Product**
   - Click "Add Product" button
   - Fill in the required fields:
     - Name (required)
     - Description
     - Stock quantity
     - Price
   - Click "Save" to create the product

3. **Edit Product**
   - Click the edit icon in the Actions column
   - Modify the desired fields
   - Click "Save" to update

4. **Delete Product**
   - Click the delete icon in the Actions column
   - Confirm deletion in the dialog

### Customer Management

1. **View Customer Products**
   - Use the customer selector dropdown
   - Type to search for specific customers
   - View selected customer's associated products

2. **Manage Customer Products**
   - Click "Add Product" in the customer view
   - Use the searchable product selector
   - Select products to associate with the customer
   - Remove products using the remove icon

## 🔄 Data Caching

The application implements smart caching strategies:

- Product and customer data is cached for 1 hour
- Cache persists across page reloads
- Cache automatically invalidates when:
  - Creating/updating/deleting products
  - Adding/removing customer products
  - Modifying customer details

## 🎨 UI Features

- Responsive design with mobile support
- Dark/light theme toggle
- Fixed table layout with proper column sizing:
  - Name: 300px
  - Description: 400px (minimum)
  - Stock: 100px (right-aligned)
  - Price: 100px (right-aligned)
  - Actions: 100px (sticky)
- Sticky headers and search boxes
- Proper scrolling behavior with visible scrollbars

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
