"use client"

import type React from "react"
import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import MoneySideBar from "@/components/MoneySideBar"
import { Menu, X } from "lucide-react"

interface ResponsiveMoneySidebarProps {
  isOpen: boolean
  toggleSidebar: () => void
}

const ResponsiveMoneySidebar: React.FC<ResponsiveMoneySidebarProps> = ({ isOpen, toggleSidebar }) => {
  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (
        isOpen &&
        !target.closest('[data-sidebar="money-sidebar"]') &&
        !target.closest('[data-sidebar-toggle="true"]')
      ) {
        toggleSidebar()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, toggleSidebar])

  return (
    <>
      {/* Mobile toggle button */}
      <button
        data-sidebar-toggle="true"
        onClick={toggleSidebar}
        className="fixed top-4 right-4 z-50 md:hidden bg-purple-700 text-white p-2 rounded-full shadow-lg"
        aria-label="Toggle money ladder"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            data-sidebar="money-sidebar"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-64 z-40 md:hidden"
          >
            <MoneySideBar />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ResponsiveMoneySidebar

