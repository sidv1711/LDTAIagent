"use client"

import { useState } from 'react'
import { UploadCloud } from 'lucide-react'
import { motion } from 'motion/react'

interface FileUploadZoneProps {
  onFileSelect?: (file: File) => void
  acceptedTypes?: string[]
  maxFileSize?: number
  disabled?: boolean
}

export default function FileUploadZone({
  onFileSelect,
  acceptedTypes = ['.pdf', '.doc', '.docx', '.txt'],
  maxFileSize = 10 * 1024 * 1024, // 10MB
  disabled = false,
}: FileUploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    if (disabled) return
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    if (disabled) return
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    if (disabled) return
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      const file = files[0]
      if (validateFile(file)) {
        onFileSelect?.(file)
      }
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && validateFile(file)) {
      onFileSelect?.(file)
    }
    e.target.value = ''
  }

  const validateFile = (file: File): boolean => {
    const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`
    const isValidType = acceptedTypes.some(type => 
      type.toLowerCase() === fileExtension || 
      file.type.includes(type.replace('.', ''))
    )
    
    if (!isValidType) {
      console.error('Invalid file type')
      return false
    }
    
    if (file.size > maxFileSize) {
      console.error('File too large')
      return false
    }
    
    return true
  }

  return (
    <div className="w-full">
      <motion.div
        className={`
          relative border-2 rounded-xl transition-all duration-300 cursor-pointer
          ${isDragOver ? 'border-primary bg-card/50' : 'border-border bg-card'}
          ${disabled ? 'cursor-not-allowed opacity-60' : 'hover:border-primary/50'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && document.getElementById('file-upload')?.click()}
        whileHover={!disabled ? { scale: 1.005 } : {}}
        whileTap={!disabled ? { scale: 0.995 } : {}}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept={acceptedTypes.join(',')}
          onChange={handleFileInputChange}
          disabled={disabled}
        />
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <motion.div
            animate={isDragOver ? { y: -5 } : { y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <UploadCloud 
              className={`
                w-20 h-20 mb-8 transition-colors
                ${isDragOver ? 'text-primary' : 'text-muted-foreground'}
              `}
              strokeWidth={1.5}
            />
          </motion.div>
          <h3 className="text-xl font-semibold text-foreground mb-3">
            Upload your LDT submission document
          </h3>
          <p className="text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
            to receive instant compliance analysis and gap identification
          </p>
          <div className="mt-6">
            <span className="text-sm text-muted-foreground">
              {acceptedTypes.join(', ')} • Max {maxFileSize / 1024 / 1024}MB
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}