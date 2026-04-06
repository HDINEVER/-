import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { Download, Plus } from 'lucide-react';
import { Responsive as ResponsiveGridLayout } from 'react-grid-layout';
import type { Layout } from 'react-grid-layout';
import { Product } from './types';
import { ProductCard } from './components/ProductCard';
import { EditModal } from './components/EditModal';
import { motion } from 'motion/react';

const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: '阿米娅毛绒玩偶',
    price: '129',
    discount: '买二送一',
    imageUrl: 'https://images.unsplash.com/photo-1558679934-c27771231a48?auto=format&fit=crop&q=80&w=400',
    tag: '热销',
    description: '罗德岛官方正版周边，手感柔软。',
    x: 0, y: 0, w: 2, h: 2
  },
  {
    id: '2',
    name: '源石金属钥匙扣',
    price: '45',
    discount: '两件减10元',
    imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=400',
    x: 2, y: 0, w: 1, h: 1
  },
  {
    id: '3',
    name: '罗德岛干员制服外套',
    price: '399',
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=400',
    tag: '会场限定',
    description: '防风防水材质，日常穿搭首选。',
    x: 3, y: 0, w: 2, h: 3
  },
  {
    id: '4',
    name: '企鹅物流鸭舌帽',
    price: '89',
    imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=400',
    x: 2, y: 1, w: 1, h: 1
  },
  {
    id: '5',
    name: '官方美术设定集 Vol.1',
    price: '199',
    discount: '附赠限定特典',
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400',
    x: 0, y: 2, w: 2, h: 1
  },
  {
    id: '6',
    name: '干员亚克力立牌',
    price: '65',
    discount: '任选3件150元',
    imageUrl: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&q=80&w=400',
    x: 2, y: 2, w: 1, h: 2
  }
];

export default function App() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posterTitle, setPosterTitle] = useState('COMIC MARKET 104');
  const [posterSubtitle, setPosterSubtitle] = useState('明日方舟 官方正版周边');
  
  const posterRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    if (!posterRef.current) return;
    
    try {
      const canvas = await html2canvas(posterRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#111111',
      });
      
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `arknights-poster-${Date.now()}.png`;
      link.click();
    } catch (error) {
      console.error('Failed to export image:', error);
      alert('导出失败，请重试。');
    }
  };

  const handleSaveProduct = (savedProduct: Product) => {
    setProducts(prev => {
      const exists = prev.find(p => p.id === savedProduct.id);
      if (exists) {
        return prev.map(p => p.id === savedProduct.id ? savedProduct : p);
      }
      return [...prev, savedProduct];
    });
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const openNewProductModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleLayoutChange = (layout: any[]) => {
    setProducts(prev => prev.map(p => {
      const item = layout.find(l => l.i === p.id);
      if (item) {
        return { ...p, x: item.x, y: item.y, w: item.w, h: item.h };
      }
      return p;
    }));
  };

  const handleSizeChange = (product: Product) => {
    setProducts(prev => prev.map(p => {
      if (p.id === product.id) {
        let newW = 1, newH = 1;
        if (p.w === 1 && p.h === 1) {
          newW = 2; newH = 2;
        } else if (p.w === 2 && p.h === 2) {
          newW = 3; newH = 3;
        } else {
          newW = 1; newH = 1;
        }
        return { ...p, w: newW, h: newH };
      }
      return p;
    }));
  };

  return (
    <div className="min-h-screen bg-ak-black text-ak-white font-sans selection:bg-ak-blue selection:text-ak-black pb-20 overflow-x-hidden">
      {/* Top Navigation / Controls */}
      <nav className="sticky top-0 z-40 bg-ak-dark/90 backdrop-blur-md border-b border-ak-gray p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-ak-blue clip-chamfer flex items-center justify-center text-ak-black font-bold font-mono">
            PR
          </div>
          <h1 className="font-display font-bold text-xl tracking-widest hidden sm:block">
            制品价格展示板
          </h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={openNewProductModal}
            className="flex items-center gap-2 px-4 py-2 bg-ak-gray hover:bg-ak-light hover:text-ak-black transition-colors font-mono text-sm uppercase"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">添加商品</span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-ak-blue text-ak-black hover:bg-white transition-colors font-mono font-bold text-sm uppercase clip-chamfer"
          >
            <Download size={16} />
            <span className="hidden sm:inline">导出海报</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="w-full overflow-x-auto mt-8 px-4 pb-8">
        {/* The Poster Container to be exported */}
        <div 
          ref={posterRef}
          className="bg-ak-black border-2 border-ak-gray p-6 sm:p-10 relative overflow-hidden mx-auto"
          style={{ width: '1200px', minHeight: '800px' }}
        >
          {/* Poster Background Decorations */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
            <div className="absolute top-0 right-0 w-64 h-64 bg-ak-blue/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-ak-yellow/5 rounded-full blur-3xl"></div>
            <div className="absolute top-10 right-10 font-mono text-[10px] text-ak-blue/50 text-right leading-tight">
              SYS.INIT // {new Date().getFullYear()}<br/>
              SECURE CONNECTION ESTABLISHED<br/>
              DATA STREAM ACTIVE
            </div>
            {/* Grid lines */}
            <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(0, 195, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 195, 255, 0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          </div>

          {/* Poster Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 mb-12 border-b-2 border-ak-gray pb-6 flex flex-col sm:flex-row justify-between items-end gap-4"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-1 w-12 bg-ak-blue"></div>
                <span className="font-mono text-ak-blue text-sm tracking-widest">CATALOGUE</span>
              </div>
              <input
                type="text"
                value={posterTitle}
                onChange={(e) => setPosterTitle(e.target.value)}
                className="bg-transparent border-none outline-none font-display font-black text-4xl sm:text-6xl text-ak-white uppercase tracking-tighter w-full"
                placeholder="输入主标题"
              />
              <input
                type="text"
                value={posterSubtitle}
                onChange={(e) => setPosterSubtitle(e.target.value)}
                className="bg-transparent border-none outline-none font-mono text-xl sm:text-2xl text-ak-light/80 uppercase tracking-widest w-full mt-2"
                placeholder="输入副标题"
              />
            </div>
            <div className="text-right hidden sm:block">
              <div className="font-mono text-4xl font-bold text-ak-gray opacity-50">
                // 01
              </div>
            </div>
          </motion.div>

          {/* Bento Grid (React Grid Layout) */}
          <div className="relative z-10">
            <ResponsiveGridLayout
              className="layout"
              layouts={{ lg: products.map(p => ({ i: p.id, x: p.x, y: p.y, w: p.w, h: p.h })) }}
              breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
              cols={{ lg: 5, md: 4, sm: 3, xs: 2, xxs: 1 }}
              rowHeight={160}
              width={1120} // 1200px container - 80px padding
              onLayoutChange={handleLayoutChange}
              margin={[16, 16]}
            >
              {products.map(product => (
                <div key={product.id}>
                  <ProductCard
                    product={product}
                    onEdit={(p) => {
                      setEditingProduct(p);
                      setIsModalOpen(true);
                    }}
                    onSizeChange={handleSizeChange}
                  />
                </div>
              ))}
            </ResponsiveGridLayout>
          </div>
          
          {/* Poster Footer */}
          <div className="relative z-10 mt-16 pt-6 border-t border-ak-gray flex justify-between items-center">
            <div className="font-mono text-xs text-ak-gray flex items-center gap-4">
              <span className="bg-ak-blue text-ak-black px-2 py-1 font-bold">WARNING</span>
              <span>警告：价格可能随实际情况变动，请以现场售价为准。</span>
            </div>
            <div className="w-32 h-8 bg-stripes-dark opacity-50"></div>
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      <EditModal
        product={editingProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        onDelete={handleDeleteProduct}
      />
    </div>
  );
}
