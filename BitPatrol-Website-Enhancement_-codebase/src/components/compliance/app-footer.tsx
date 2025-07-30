"use client"

import Link from "next/link"
import { ShieldCheck, MessageCircle, LifeBuoy, FileText } from "lucide-react"

interface FooterLink {
  label: string
  href: string
}

interface FooterSection {
  title: string
  links: FooterLink[]
}

const footerSections: FooterSection[] = [
  {
    title: "Product",
    links: [
      { label: "Compliance Analysis", href: "/compliance-analysis" },
      { label: "Gap Reports", href: "/gap-reports" },
      { label: "Regulatory Q&A", href: "/regulatory-qa" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "FDA Guidance", href: "/fda-guidance" },
      { label: "CUA Requirements", href: "/cua-requirements" },
      { label: "Documentation", href: "/documentation" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "/help-center" },
      { label: "Contact Us", href: "/contact" },
      { label: "API Status", href: "/api-status" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms-of-service" },
      { label: "Security", href: "/security" },
    ],
  },
]

export default function AppFooter() {
  return (
    <footer className="bg-[#f8fafc] dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-12 border-t border-slate-200 dark:border-slate-800 pt-8">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="h-5 w-5 text-slate-400 dark:text-slate-500" />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Enterprise-Grade Security
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <LifeBuoy className="h-4 w-4 text-slate-400 dark:text-slate-500" />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                24/7 Technical Support
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-slate-400 dark:text-slate-500" />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                SOC 2 Compliant
              </span>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              &copy; {new Date().getFullYear()} Compliance Platform. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}