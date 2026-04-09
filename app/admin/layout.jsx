import AdminLayout from "@/components/admin/AdminLayout";

export const metadata = {
    title: "INOVE-DEV - Administração",
    description: "Painel Administrativo da INOVE-DEV",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <AdminLayout>
                {children}
            </AdminLayout>
        </>
    );
}
