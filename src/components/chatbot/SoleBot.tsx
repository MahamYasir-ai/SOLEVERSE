import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, User, ArrowRight, Package, AlertCircle, CheckCircle2, Ruler } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useNavigate } from '../../context/NavigationContext';
import { processChatbotQuery } from '../../data/chatbotKnowledge';
import { Order, Product } from '../../types';
import { formatPKR } from '../../lib/currency';
import { formatComplaintWhatsApp, formatOrderInquiry, getWhatsAppChatUrl } from '../../lib/whatsapp';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  quickReplies?: string[];
  products?: Product[];
  orderInfo?: Order;
  action?: string;
  complaintRef?: string;
}

export const SoleBot: React.FC = () => {
  const { products, orders, fileComplaint, addToast } = useStore();
  const { navigate } = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Complaint Form State
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [complaintCategory, setComplaintCategory] = useState<'Damaged item' | 'Wrong size' | 'Delivery delay' | 'Quality issue' | 'Other'>('Wrong size');
  const [complaintOrderNum, setComplaintOrderNum] = useState('');
  const [complaintDesc, setComplaintDesc] = useState('');
  const [complaintName, setComplaintName] = useState('');
  const [complaintPhone, setComplaintPhone] = useState('');
  const [complaintResolution, setComplaintResolution] = useState<'Replacement' | 'Store Credit' | 'Exchange' | 'Manager Callback'>('Exchange');

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-01',
      sender: 'bot',
      text: "Yo! Welcome to SOLEVERSE 👟 What can I help you find today? I'm connected to our live Pakistan warehouse inventory and order tracking system.",
      timestamp: 'Just now',
      quickReplies: [
        'Track my order',
        'Find my size',
        'Futuristic kicks',
        'Chunky sneakers',
        'Discount codes',
        'Shipping & COD',
        'Report a problem',
      ],
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Realistic typing delay (350ms)
    setTimeout(() => {
      const response = processChatbotQuery(text, products, orders);

      if (response.action === 'open_complaint_form') {
        setShowComplaintForm(true);
      }

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickReplies: response.quickReplies,
        products: response.products,
        orderInfo: response.orderInfo,
        action: response.action,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 400);
  };

  const handleQuickReply = (reply: string) => {
    if (reply === 'Report a problem' || reply === 'File a Complaint Ticket' || reply === 'File an Exchange Ticket') {
      setShowComplaintForm(true);
      return;
    }
    if (reply === 'Track on full page' || reply === 'Open Order Tracker') {
      navigate('/track-order');
      setIsOpen(false);
      return;
    }
    if (reply === 'Open Size Guide Modal') {
      navigate('/size-guide');
      setIsOpen(false);
      return;
    }
    if (reply === 'Chat on WhatsApp' || reply === 'Inquire via WhatsApp' || reply === 'Talk to Human on WhatsApp') {
      const wa = getWhatsAppChatUrl('Hi SOLEVERSE! I need assistance with my order and sizing.');
      window.open(wa.url, '_blank');
      return;
    }
    handleSend(reply);
  };

  const handleSubmitComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintDesc.trim() || !complaintName.trim() || !complaintPhone.trim()) {
      addToast('Please fill out all required complaint fields.', 'warning');
      return;
    }

    const created = fileComplaint(
      complaintCategory,
      complaintDesc,
      complaintName,
      complaintPhone,
      complaintResolution,
      complaintOrderNum.trim() || undefined
    );

    setShowComplaintForm(false);
    const waUrl = getWhatsAppChatUrl(formatComplaintWhatsApp(created)).url;

    const confirmMsg: Message = {
      id: `bot-comp-${Date.now()}`,
      sender: 'bot',
      text: `Your complaint ticket *#${created.id}* has been registered in the local demo system! Preferred resolution: *${created.preferredResolution}*.\n\nYou can also forward this ticket directly to our management on WhatsApp for faster handling.`,
      timestamp: 'Just now',
      complaintRef: created.id,
      quickReplies: ['Track Another Order', 'Continue Shopping'],
    };

    setMessages((prev) => [...prev, confirmMsg]);
    setComplaintDesc('');
    setComplaintOrderNum('');
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-[#17151C] text-[#C8FF35] border-2 border-[#C8FF35] shadow-2xl hover:scale-105 active:scale-95 transition-all focus-visible:outline-2 focus-visible:outline-white group flex items-center gap-2"
        aria-label="Open SOLE BOT Customer Support"
      >
        <Bot className="w-6 h-6 text-[#C8FF35] group-hover:rotate-12 transition-transform" />
        <span className="hidden sm:inline font-mono font-bold text-xs text-white">
          SOLE BOT
        </span>
        {hasUnread && !isOpen && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#FF4F9A] border-2 border-[#17151C] animate-pulse" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[420px] max-h-[640px] h-[82vh] bg-[#17151C] text-[#FAF8F4] border border-stone-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          
          {/* Top Bar */}
          <div className="p-4 bg-stone-900 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#C8FF35] flex items-center justify-center text-[#17151C] font-black text-sm">
                🤖
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-display font-bold text-sm text-white">SOLE BOT</h4>
                  <span className="text-[10px] font-mono text-emerald-400">Warehouse Connected</span>
                </div>
                <p className="text-[11px] text-stone-400">Live Inventory & Order Support</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const wa = getWhatsAppChatUrl('Salam SOLEVERSE! Escalating from SoleBot for human sneakerhead advice.');
                  window.open(wa.url, '_blank');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition-all shadow-md shadow-[#25D366]/20 font-mono"
                title="Direct WhatsApp Concierge"
              >
                <MessageSquare className="w-3.5 h-3.5 fill-current" />
                <span>WhatsApp</span>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-stone-400 hover:text-white rounded-lg transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-lg bg-[#C8FF35] text-[#17151C] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    S
                  </div>
                )}

                <div className={`max-w-[85%] space-y-2`}>
                  <div
                    className={`p-3.5 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-[#C8FF35] text-[#17151C] font-medium rounded-tr-none'
                        : 'bg-stone-900 border border-stone-800 text-stone-200 rounded-tl-none whitespace-pre-line'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Render Embedded Product Recommendations */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      {msg.products.map((prod) => (
                        <div
                          key={prod.id}
                          onClick={() => {
                            navigate(`/products/${prod.slug}`);
                            setIsOpen(false);
                          }}
                          className="p-2 rounded-xl bg-stone-900/90 border border-stone-800 hover:border-[#C8FF35]/50 flex items-center gap-2.5 cursor-pointer transition-colors"
                        >
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            className="w-12 h-12 rounded-lg object-cover bg-stone-800 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="font-bold text-white truncate text-xs">{prod.name}</h5>
                            <span className="text-[11px] font-mono text-[#C8FF35] block">
                              {formatPKR(prod.price)}
                            </span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Render Embedded Order Tracking Card */}
                  {msg.orderInfo && (
                    <div className="p-3 rounded-2xl bg-stone-900 border border-[#C8FF35]/30 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-white font-bold">{msg.orderInfo.id}</span>
                        <span className="text-[#C8FF35] font-bold uppercase">{msg.orderInfo.status}</span>
                      </div>
                      <div className="text-[11px] text-stone-300">
                        <p>Courier: <b>{msg.orderInfo.courierName}</b></p>
                        <p>Tracking: <b>{msg.orderInfo.trackingNumber}</b></p>
                        <p>Total: <b>{formatPKR(msg.orderInfo.pricing.total)}</b></p>
                      </div>
                      <button
                        onClick={() => {
                          navigate(`/track-order?id=${msg.orderInfo?.id}`);
                          setIsOpen(false);
                        }}
                        className="w-full py-1.5 rounded-lg bg-stone-800 hover:bg-[#C8FF35] hover:text-[#17151C] text-xs font-bold font-mono transition-colors"
                      >
                        View Full Milestone Timeline →
                      </button>
                    </div>
                  )}

                  {/* Quick Replies */}
                  {msg.quickReplies && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.quickReplies.map((reply) => (
                        <button
                          key={reply}
                          onClick={() => handleQuickReply(reply)}
                          className="px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-800 text-[11px] text-stone-300 hover:text-[#C8FF35] transition-colors"
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  )}

                  <span className="text-[9px] font-mono text-stone-500 block px-1">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-stone-400 text-xs font-mono">
                <div className="w-5 h-5 rounded-lg bg-[#C8FF35] text-[#17151C] flex items-center justify-center text-[10px] font-bold">
                  S
                </div>
                <div className="p-2 rounded-xl bg-stone-900 border border-stone-800 flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C8FF35] animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C8FF35] animate-bounce [animation-delay:0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C8FF35] animate-bounce [animation-delay:0.3s]" />
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Embedded Complaint Form */}
          {showComplaintForm && (
            <div className="p-4 bg-stone-900 border-t border-stone-800 text-xs animate-in slide-in-from-bottom-2">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-800">
                <span className="font-bold text-white uppercase tracking-wider font-mono text-[11px] flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-[#FF873D]" /> File a Complaint Ticket
                </span>
                <button
                  onClick={() => setShowComplaintForm(false)}
                  className="text-stone-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitComplaint} className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-stone-400 block mb-0.5">Category *</label>
                    <select
                      value={complaintCategory}
                      onChange={(e) => setComplaintCategory(e.target.value as any)}
                      className="w-full bg-stone-800 border border-stone-700 rounded-lg p-1.5 text-xs text-white"
                    >
                      <option value="Wrong size">Wrong size</option>
                      <option value="Damaged item">Damaged item</option>
                      <option value="Delivery delay">Delivery delay</option>
                      <option value="Quality issue">Quality issue</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-stone-400 block mb-0.5">Order # (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. SV-PK-782914"
                      value={complaintOrderNum}
                      onChange={(e) => setComplaintOrderNum(e.target.value)}
                      className="w-full bg-stone-800 border border-stone-700 rounded-lg p-1.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-stone-400 block mb-0.5">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={complaintName}
                      onChange={(e) => setComplaintName(e.target.value)}
                      className="w-full bg-stone-800 border border-stone-700 rounded-lg p-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-stone-400 block mb-0.5">Phone Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="0300-1234567"
                      value={complaintPhone}
                      onChange={(e) => setComplaintPhone(e.target.value)}
                      className="w-full bg-stone-800 border border-stone-700 rounded-lg p-1.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-stone-400 block mb-0.5">Description *</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Describe the issue with the pair or courier delivery..."
                    value={complaintDesc}
                    onChange={(e) => setComplaintDesc(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg p-1.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-stone-400 block mb-0.5">Preferred Resolution *</label>
                  <select
                    value={complaintResolution}
                    onChange={(e) => setComplaintResolution(e.target.value as any)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg p-1.5 text-xs text-white"
                  >
                    <option value="Exchange">Hassle-Free Size Exchange</option>
                    <option value="Replacement">Doorstep Replacement</option>
                    <option value="Store Credit">Store Credit Voucher</option>
                    <option value="Manager Callback">Manager Phone Callback</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-[#FF873D] hover:bg-[#f07b32] text-[#17151C] font-bold rounded-lg text-xs font-mono uppercase tracking-wider transition-colors"
                >
                  Submit Ticket (Saved Locally in Demo)
                </button>
              </form>
            </div>
          )}

          {/* Message Input Field */}
          <div className="p-3 bg-stone-900 border-t border-stone-800 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about sizes, drops, tracking..."
              className="flex-1 bg-stone-800 border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#C8FF35]"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="p-2.5 rounded-xl bg-[#C8FF35] hover:bg-[#bbf325] text-[#17151C] disabled:opacity-40 transition-colors"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
