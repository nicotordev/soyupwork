"use client";

import { AdminDashboardContainer } from "@/components/admin/admin-dashboard-container";
import { motion } from "framer-motion";
import { IconSearch } from "@tabler/icons-react";

export default function AdminNotFound() {
  return (
    <AdminDashboardContainer>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto flex flex-col items-center justify-center py-20"
      >
        <div className="flex items-center justify-center rounded-full bg-muted p-4 shadow-md mb-6">
          <IconSearch className="w-8 h-8 text-muted-foreground" stroke={2} />
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight mb-2">No encontrado</h2>
        <p className="text-muted-foreground mb-6 text-center">
          La página de administración que buscas no existe o ha sido movida.
        </p>
        <a
          href="/admin"
          className="inline-block px-6 py-2 rounded font-bold bg-secondary text-foreground border-2 border-foreground shadow-[2px_2px_0px_0px_var(--foreground)] hover:bg-muted transition-colors"
        >
          Volver al panel principal
        </a>
      </motion.div>
    </AdminDashboardContainer>
  );
}
