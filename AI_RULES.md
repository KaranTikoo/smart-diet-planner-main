# AI Rules for Smart Diet Planner

This document outlines the core technologies used in this project and provides guidelines for using specific libraries to maintain consistency and best practices.

## Tech Stack

*   **Vite**: A fast build tool that provides an instant development server and bundles your code for production.
*   **React**: A JavaScript library for building user interfaces, focusing on a component-based architecture.
*   **TypeScript**: A superset of JavaScript that adds static type definitions, improving code quality and maintainability.
*   **Tailwind CSS**: A utility-first CSS framework for rapidly building custom designs directly in your markup.
*   **shadcn/ui**: A collection of re-usable components built with Radix UI and Tailwind CSS, providing accessible and customizable UI elements.
*   **React Router**: A standard library for routing in React applications, enabling navigation between different views.
*   **Supabase**: An open-source Firebase alternative providing a PostgreSQL database, authentication, and real-time subscriptions.
*   **React Hook Form & Zod**: Libraries for efficient form management and schema-based validation.
*   **Lucide React**: A collection of beautiful and customizable open-source icons.
*   **Sonner**: A modern toast component for displaying notifications.
*   **Recharts**: A composable charting library built on React components for data visualization.

## Library Usage Rules

To ensure consistency and maintainability, please adhere to the following guidelines when developing:

*   **UI Components**: Always use components from `shadcn/ui` (e.g., `Button`, `Input`, `Card`, `Dialog`, `Tabs`, `Select`, `Checkbox`, `RadioGroup`, `Slider`, `Switch`, `Textarea`, `Progress`, `Badge`, `Separator`, `Calendar`). If a required component is not available in `shadcn/ui`, create a new component in `src/components/ui/` following the `shadcn/ui` styling conventions.
*   **Styling**: All styling must be done using **Tailwind CSS** classes. Avoid inline styles or custom CSS files unless absolutely necessary for very specific, isolated cases (and only after discussion).
*   **Routing**: Use **React Router** (`react-router-dom`) for all client-side navigation and route management.
*   **Forms & Validation**: Use **React Hook Form** for managing form state and **Zod** for schema validation.
*   **Icons**: Integrate icons using the **Lucide React** library.
*   **Notifications**: For toast notifications, use the `sonner` library.
*   **Backend & Authentication**: Interact with the backend and handle user authentication using **Supabase**.
*   **Data Visualization**: For charts and graphs, use **Recharts**.
*   **Date Handling**: For date manipulation and formatting, use `date-fns`.
*   **Utility Functions**: For combining and merging CSS classes, use `clsx` and `tailwind-merge` via the `cn` utility function.