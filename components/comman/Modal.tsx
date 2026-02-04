'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { classNames } from '../kyc-onboarding-sdk/ui';
import React from 'react';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ModalProps {
  /** Controls modal visibility */
  isOpen: boolean;

  /** Called when modal should close */
  onClose: () => void;

  /** Main modal content */
  children: React.ReactNode;

  /** Header title */
  title?: string;

  /** Header description */
  description?: string;

  /** Modal width */
  size?: ModalSize;

  /** Show close (X) button */
  showCloseButton?: boolean;

  /** Close when clicking backdrop */
  closeOnOverlayClick?: boolean;

  /** Close when pressing escape */
  closeOnEscape?: boolean;

  /** Footer content */
  footer?: React.ReactNode;
}

export function Modal({
  isOpen,
  onClose,
  children,
  title,
  description,
  size = 'xl',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  footer,
  loading = false,
}: ModalProps & { loading?: boolean }) {
  const modalRef = useRef<HTMLDivElement>(null);



  /* ---------- escape key ---------- */
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose, loading]);

  /* ---------- body scroll lock ---------- */
  useEffect(() => {

    if (isOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  /* ---------- sizes ---------- */
  const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };

  /* ---------- overlay click ---------- */
  const handleOverlayClick = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    if (loading) return;

    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  /* ---------- modal ---------- */
  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={modalRef}
        className={classNames(
          'relative w-full bg-white rounded-xl shadow-2xl animate-in zoom-in-95 duration-200',
          sizeStyles[size]
        )}
      >
        {/* HEADER */}
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between p-6 pb-4 border-b border-gray-200">
            <div className="flex-1">
              {title && (
                <h2 className="text-xl font-semibold text-gray-900">
                  {title}
                </h2>
              )}

              {description && (
                <p className="mt-1 text-sm text-gray-600">
                  {description}
                </p>
              )}
            </div>

            {showCloseButton && (
              <button
                onClick={() => !loading && onClose()}
                disabled={loading}
                className="ml-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
              >
                ✕
              </button>
            )}
          </div>
        )}

        {/* BODY */}
        <div className="relative p-6 max-h-[calc(100vh-12rem)] overflow-y-auto">
          {children}

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm rounded-xl">
              <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* FOOTER */}
        {footer && (
          <div className="flex items-center justify-end gap-3 p-6 pt-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
