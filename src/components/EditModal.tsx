import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface EditModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  onDelete?: (id: string) => void;
}

export function EditModal({ product, isOpen, onClose, onSave, onDelete }: EditModalProps) {
  const [formData, setFormData] = useState<Product | null>(null);

  useEffect(() => {
    if (product) {
      setFormData({ ...product });
    } else {
      setFormData({
        id: Math.random().toString(36).substr(2, 9),
        name: '',
        price: '',
        discount: '',
        imageUrl: '',
        tag: '',
        description: '',
        x: 0,
        y: Infinity,
        w: 1,
        h: 1,
        imagePosition: 'center'
      });
    }
  }, [product, isOpen]);

  if (!formData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => prev ? { ...prev, imageUrl: reader.result as string } : null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onSave(formData);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-ak-dark border border-ak-blue w-full max-w-2xl clip-chamfer relative overflow-hidden flex flex-col max-h-[90vh] shadow-[0_0_30px_rgba(0,195,255,0.1)]"
          >
            {/* Header */}
            <div className="bg-ak-gray/50 p-4 border-b border-ak-gray flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-2 h-6 bg-ak-blue"></div>
                <h2 className="font-display font-bold text-xl tracking-widest text-ak-white">
                  {product ? '编辑模块' : '新增模块'}
                </h2>
              </div>
              <button onClick={onClose} className="text-ak-light hover:text-ak-blue transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Image */}
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-xs text-ak-blue uppercase tracking-wider">商品图片</label>
                  <div className="relative aspect-square bg-ak-black border border-dashed border-ak-gray flex flex-col items-center justify-center group hover:border-ak-blue transition-colors cursor-pointer overflow-hidden">
                    {formData.imageUrl ? (
                      <img 
                        src={formData.imageUrl} 
                        alt="Preview" 
                        className="w-full h-full object-cover" 
                        style={{ objectPosition: formData.imagePosition || 'center' }}
                      />
                    ) : (
                      <div className="flex flex-col items-center text-ak-gray group-hover:text-ak-blue transition-colors">
                        <ImageIcon size={48} className="mb-2" />
                        <span className="font-mono text-sm">点击上传图片</span>
                      </div>
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                  <input
                    type="text"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="或在此粘贴图片 URL..."
                    className="bg-ak-black border border-ak-gray p-2 text-sm font-mono text-ak-white focus:border-ak-blue focus:outline-none w-full"
                  />
                  
                  {/* Image Position Selector */}
                  <div className="flex flex-col gap-1 mt-2">
                    <label className="font-mono text-xs text-ak-blue uppercase tracking-wider">图片显示位置</label>
                    <div className="grid grid-cols-3 gap-1 w-full max-w-[120px] mx-auto mt-1">
                      {[
                        { value: 'top left', label: '↖' },
                        { value: 'top', label: '↑' },
                        { value: 'top right', label: '↗' },
                        { value: 'left', label: '←' },
                        { value: 'center', label: '·' },
                        { value: 'right', label: '→' },
                        { value: 'bottom left', label: '↙' },
                        { value: 'bottom', label: '↓' },
                        { value: 'bottom right', label: '↘' }
                      ].map(pos => (
                        <button
                          key={pos.value}
                          type="button"
                          onClick={() => setFormData(prev => prev ? { ...prev, imagePosition: pos.value } : null)}
                          className={cn(
                            "h-8 flex items-center justify-center border transition-colors text-lg",
                            (formData.imagePosition || 'center') === pos.value
                              ? "bg-ak-blue text-ak-black border-ak-blue"
                              : "bg-ak-black text-ak-gray border-ak-gray hover:border-ak-blue hover:text-ak-blue"
                          )}
                          title={pos.value}
                        >
                          {pos.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-xs text-ak-blue uppercase tracking-wider">商品名称</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="bg-ak-black border border-ak-gray p-3 font-display font-bold text-ak-white focus:border-ak-blue focus:outline-none"
                      placeholder="例如：罗德岛干员外套"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-xs text-ak-blue uppercase tracking-wider">单价 (¥)</label>
                    <input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      className="bg-ak-black border border-ak-gray p-3 font-mono font-bold text-ak-white focus:border-ak-blue focus:outline-none"
                      placeholder="例如：299"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-xs text-ak-blue uppercase tracking-wider">折扣信息 (选填)</label>
                    <input
                      type="text"
                      name="discount"
                      value={formData.discount || ''}
                      onChange={handleChange}
                      className="bg-ak-black border border-ak-gray p-3 font-mono text-sm text-ak-white focus:border-ak-blue focus:outline-none"
                      placeholder="例如：两件减20元 / 买二送一"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-xs text-ak-blue uppercase tracking-wider">标签 (选填)</label>
                    <input
                      type="text"
                      name="tag"
                      value={formData.tag || ''}
                      onChange={handleChange}
                      className="bg-ak-black border border-ak-gray p-3 font-mono text-sm text-ak-white focus:border-ak-blue focus:outline-none"
                      placeholder="例如：限定 / 现货"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-xs text-ak-blue uppercase tracking-wider">卡片大小</label>
                    <div className="flex gap-2">
                      {[
                        { label: '小 (1x1)', w: 1, h: 1 },
                        { label: '中 (2x2)', w: 2, h: 2 },
                        { label: '大 (3x3)', w: 3, h: 3 }
                      ].map(size => (
                        <button
                          key={size.label}
                          type="button"
                          onClick={() => setFormData(prev => prev ? { ...prev, w: size.w, h: size.h } : null)}
                          className={cn(
                            "flex-1 py-2 font-mono text-sm border transition-colors",
                            formData.w === size.w && formData.h === size.h
                              ? "bg-ak-blue text-ak-black border-ak-blue font-bold"
                              : "bg-ak-black text-ak-white border-ak-gray hover:border-ak-blue"
                          )}
                        >
                          {size.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-xs text-ak-blue uppercase tracking-wider">描述 (选填)</label>
                    <textarea
                      name="description"
                      value={formData.description || ''}
                      onChange={handleChange}
                      rows={2}
                      className="bg-ak-black border border-ak-gray p-3 font-sans text-sm text-ak-white focus:border-ak-blue focus:outline-none resize-none"
                      placeholder="简短的商品描述..."
                    />
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="mt-4 pt-4 border-t border-ak-gray flex justify-between items-center">
                {product && onDelete ? (
                  <button
                    type="button"
                    onClick={() => { onDelete(product.id); onClose(); }}
                    className="text-ak-red font-mono text-sm hover:underline"
                  >
                    删除模块
                  </button>
                ) : <div></div>}
                
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2 border border-ak-gray text-ak-light font-mono hover:bg-ak-gray transition-colors"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-2 bg-ak-blue text-ak-black font-bold font-mono hover:bg-white transition-colors clip-chamfer"
                  >
                    保存数据
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
