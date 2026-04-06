import React from 'react';
import { Product } from '../types';
import { cn } from '../lib/utils';
import { Edit2, GripHorizontal } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onSizeChange?: (product: Product) => void;
  className?: string;
}

export function ProductCard({ product, onEdit, onSizeChange, className }: ProductCardProps) {
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onSizeChange) {
      onSizeChange(product);
    }
  };

  return (
    <div
      onContextMenu={handleContextMenu}
      className={cn(
        "group relative overflow-hidden bg-ak-dark border border-ak-gray transition-colors duration-300 hover:border-ak-blue clip-chamfer-tr-bl flex flex-col h-full w-full",
        className
      )}
    >
      {/* Drag Handle */}
      <div className="absolute top-0 right-0 z-30 p-2 cursor-move opacity-0 group-hover:opacity-100 transition-opacity drag-handle bg-ak-black/60 rounded-bl-lg backdrop-blur-sm">
        <GripHorizontal size={20} className="text-ak-gray hover:text-ak-blue" />
      </div>

      {/* Edit Overlay */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-center justify-center backdrop-blur-sm pointer-events-none">
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(product); }}
          className="pointer-events-auto flex items-center gap-2 bg-ak-blue text-ak-black px-6 py-3 font-bold uppercase tracking-wider clip-chamfer hover:bg-white transition-colors"
        >
          <Edit2 size={18} />
          编辑模块
        </button>
      </div>

      {/* Tag */}
      {product.tag && (
        <div className="absolute top-0 left-0 z-20 bg-ak-yellow text-ak-black px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest clip-chamfer-tl-br shadow-md">
          {product.tag}
        </div>
      )}

      {/* Image Container */}
      <div className="absolute inset-0 w-full h-full bg-ak-black">
        <div className="absolute inset-0 bg-stripes-dark opacity-30 pointer-events-none"></div>
        <div className="absolute top-2 right-2 text-[10px] font-mono text-ak-gray pointer-events-none z-10">
          ID:{product.id.substring(0, 8).toUpperCase()}
        </div>
        
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover relative z-0 transition-transform duration-500 group-hover:scale-105 pointer-events-none"
            style={{ objectPosition: product.imagePosition || 'center' }}
            crossOrigin="anonymous"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ak-gray font-mono text-sm border border-dashed border-ak-gray p-4 pointer-events-none">
            无图像数据
          </div>
        )}
      </div>

      {/* Info Container - Transparent overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pt-24 bg-gradient-to-t from-black/90 via-black/60 to-transparent pointer-events-none z-10 flex flex-col justify-end">
        <div className="absolute bottom-0 left-0 w-12 h-[2px] bg-ak-blue transition-all duration-300 group-hover:w-full"></div>
        
        <div className="flex justify-between items-end gap-4">
          <div className="flex-1">
            <h3 className="font-display font-bold text-lg leading-tight text-white tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {product.name}
            </h3>
            {product.description && (
              <p className="text-xs text-gray-200 mt-1 line-clamp-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                {product.description}
              </p>
            )}
            {product.discount && (
              <div className="mt-2 inline-block border border-ak-blue/50 bg-ak-blue/20 backdrop-blur-sm px-2 py-0.5 text-xs text-ak-blue font-bold clip-chamfer-tl-br shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                {product.discount}
              </div>
            )}
          </div>
          <div className="flex flex-col items-end shrink-0">
            <span className="text-[10px] font-mono text-ak-yellow mb-[-4px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">售价</span>
            <div className="font-mono font-bold text-2xl text-ak-yellow flex items-baseline drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              <span className="text-sm mr-1">¥</span>
              {product.price}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
