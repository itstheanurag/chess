import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion, easeInOut } from "framer-motion";
import { useUIStore } from "@/stores";
import Sidebar from "./SideBar";
import { Menu } from "lucide-react";

const pageVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};


const DashboardLayout: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { activeSection, collapsed } = useUIStore();
  const location = useLocation();

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      <Sidebar isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />

      <div
        className={`flex-1 transition-all duration-300 ${
          collapsed ? "lg:ml-20" : "lg:ml-80"
        } md:ml-0`}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 w-full bg-white border-b border-neutral-200 p-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleDrawer}
              className="lg:hidden rounded-md hover:bg-neutral-100"
            >
              <Menu className="h-6 w-6 text-neutral-700" />
            </button>

            <div className="font-semibold text-neutral-900 capitalize p-3">
              {activeSection}
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.35, ease: easeInOut }}
            className="p-4"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DashboardLayout;
