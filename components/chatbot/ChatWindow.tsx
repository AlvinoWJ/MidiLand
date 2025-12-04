"use client";

import { FC, useRef, useEffect, Fragment } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button"; 
import EmojiPicker, { type EmojiClickData } from 'emoji-picker-react';
export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "bot";
  name?: string;
  avatar?: string;
  timestamp: number;
  status?: "pending" | "sent" | "read" | "failed";
  isConfirmation?: boolean;
}

interface ChatWindowProps {
  messages: ChatMessage[];
  isBotTyping: boolean;
  onClose: () => void;
  onSend: (text: string) => void;
  isInputDisabled: boolean; 
  onPromptEndSession: () => void;
  onConfirmEndSession: () => void;
  onCancelEndSession: () => void;
  draftMessage: string;
  onDraftMessageChange: (text: string) => void;
  showEmojiPicker: boolean;
  onShowEmojiPickerToggle: () => void;
  onRetrySend: (messageId: string) => void;
}

const formatChatDate = (timestamp: number): string => {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(timestamp));
};

const formatChatTime = (timestamp: number): string => {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(timestamp));
};

const DateSeparator: FC<{ date: string }> = ({ date }) => (
  <div className="flex justify-center mb-4">
    <span className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">
      {date}
    </span>
  </div>
);

const TypingIndicator: FC = () => (
  <div className="flex items-end max-w-xs mb-3">
    <Image 
      src="/MidiLand.png" 
      alt="MidiLand Assisten" 
      width={32} 
      height={32} 
      className="rounded-full mr-2 flex-shrink-0 bg-gray-100 object-contain p-1"
    />
    <div className="flex flex-col">
      <span className="text-xs text-gray-500 mb-1 ml-2">MidiLand Assisten</span>
      <div className="bg-gray-100 p-3 rounded-lg rounded-bl-none">
        <div className="flex space-x-1 py-1">
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
        </div>
      </div>
    </div>
  </div>
);

const ReadReceipt: FC<{
  status?: "pending" | "sent" | "read" | "failed";
  messageId: string;
  onRetry: (id: string) => void;
}> = ({ status, messageId, onRetry }) => {
  if (status === "failed") {
    return (
      <button 
        onClick={() => onRetry(messageId)} 
        className="ml-1.5 text-red-300 hover:text-white"
        title="Gagal terkirim. Klik untuk coba lagi."
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </button>
    );
  }
  if (status === "pending") {
    return (
      <svg className="w-4 h-4 ml-1 text-red-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  }
  if (status === "sent") {
    return (
      <svg className="w-4 h-4 ml-1 text-red-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    );
  }
  if (status === "read") {
    return (
      <svg className="w-4 h-4 ml-1 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13l4 4L23 7" opacity="0.6" />
      </svg>
    );
  }
  return null;
};
const ChatWindow: FC<ChatWindowProps> = ({
  messages,
  isBotTyping,
  onClose,
  onSend,
  isInputDisabled,
  onPromptEndSession,
  onConfirmEndSession,
  onCancelEndSession,
  draftMessage,
  onDraftMessageChange,
  showEmojiPicker,
  onShowEmojiPickerToggle,
  onRetrySend,
}) => {
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const handleSend = () => {
    if (draftMessage.trim()) {
      onSend(draftMessage);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onDraftMessageChange(draftMessage + emojiData.emoji);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isBotTyping]);

  return (
    <div className="fixed bottom-20 right-4 left-4 md:left-auto md:w-96 z-50 font-sans">
      <div 
        className="absolute z-50 pointer-events-none" 
        style={{ top: "-75px", left: "-5px" }}
      >
          <img
            src="/midiland-assistant.svg"
            alt="Milan Virtual Assistant"
            width={160}
            height={160}
            className="object-contain drop-shadow-xl"
            style={{ width: '160px', height: '160px' }}
          />
      </div>

      <div className="flex flex-col w-full h-[70vh] max-h-[600px] bg-white rounded-[24px] shadow-2xl overflow-hidden border border-gray-100 relative z-10">
        <div className="relative w-full h-[85px] bg-[#D32F2F] flex items-center overflow-hidden px-4 shrink-0">
          <div className="absolute -right-12 -top-16 w-40 h-40 bg-[#E53935] rounded-full opacity-40"></div>
          <div className="absolute -left-10 -bottom-20 w-32 h-32 bg-[#E53935] rounded-full opacity-30"></div>

          <div className="flex flex-col ml-[130px] text-white z-10">
            <h2 className="text-xl font-bold tracking-wide">Milan</h2>
            <p className="text-[12px] text-red-100 opacity-90">Virtual Assistant Andalanmu!</p>
          </div>

          <div className="absolute top-2 right-3 flex space-x-1 z-20">
            <button
              onClick={onPromptEndSession}
              className="w-8 h-8 bg-black/10 hover:bg-black/20 rounded-full flex items-center justify-center transition backdrop-blur-sm"
              title="Hapus Riwayat Chat"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
             <button
              onClick={onClose}
              className="w-8 h-8 bg-black/10 hover:bg-black/20 rounded-full flex items-center justify-center transition backdrop-blur-sm"
              title="Tutup Chat"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-white px-4 pt-4">
           {messages.map((msg, index) => {
            const currentDateStr = formatChatDate(msg.timestamp);
            let prevDateStr: string | null = null;
            if (index > 0) {
              prevDateStr = formatChatDate(messages[index - 1].timestamp);
            }
            const showDateSeparator = currentDateStr !== prevDateStr;
            
            if (msg.isConfirmation) {
              return (
                <div key={msg.id} className="flex justify-start -mt-5">
                  <div className="flex items-end max-w-xs w-full">
                    <div className="w-8 h-8 mr-2 flex-shrink-0" />
                    <div className="bg-white p-4 rounded-lg text-center shadow-sm flex-1 border border-gray-100">
                      <p className="text-xs text-gray-800 mb-3">
                        Anda yakin ingin menghapus riwayat chat ini?
                      </p>
                      <div className="flex justify-center space-x-3">
                        <Button
                          variant="outline"
                          onClick={onCancelEndSession}
                          className="h-9 px-6 text-xs hover:bg-gray-100 hover:text-gray-900"
                        >
                          Batal
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={onConfirmEndSession}
                          className="h-9 px-6 text-xs bg-red-600 hover:bg-red-700 text-white"
                        >
                          Ya, Hapus
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Fragment key={msg.id}>
                {showDateSeparator && <DateSeparator date={currentDateStr} />}
                
                <div className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-3`}>
                  {msg.sender === 'bot' && (
                    <div className="flex items-end max-w-xs mb-3">
                      {msg.avatar ? (
                        <Image 
                          src={msg.avatar} 
                          alt={msg.name || 'bot'} 
                          width={32} 
                          height={32} 
                          className="rounded-full mr-2 flex-shrink-0 bg-gray-100 object-contain p-1" 
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 mr-2 flex-shrink-0" />
                      )}
                      <div className="flex flex-col">
                        {msg.name && <span className="text-xs text-gray-500 mb-1 ml-2">{msg.name}</span>}
                        <div className="bg-gray-100 p-3 rounded-lg rounded-bl-none">
                          <p className="text-xs text-gray-800" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                          <span className="text-xs text-gray-500 mt-1 text-right block">
                            {formatChatTime(msg.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {msg.sender === 'user' && (
                    <div className="flex items-end max-w-xs mb-3">
                      
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-gray-500 mb-1 mr-1 font-medium">
                            {msg.name || "Anda"}
                        </span>

                        <div className="bg-red-600 text-white p-3 rounded-lg rounded-br-none shadow-sm">
                          <p className="text-xs" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                          <div className="flex justify-end items-center mt-1">
                            <span className="text-xs text-red-200 opacity-80">
                              {formatChatTime(msg.timestamp)}
                            </span>
                            <ReadReceipt
                              status={msg.status}
                              messageId={msg.id}
                              onRetry={onRetrySend}
                            />
                          </div>
                        </div>
                      </div>

                      {msg.avatar ? (
                        <Image src={msg.avatar} alt="user" width={32} height={32} className="rounded-full ml-2 flex-shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-300 ml-2 flex-shrink-0" />
                      )}
                    </div>
                  )}
                </div>
              </Fragment>
            );
          })}
          
          {isBotTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-3 bg-white border-t">
          <div className="flex items-center gap-2">
            
            <button 
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50 transition-colors" 
              disabled={isInputDisabled} 
              title="Emoji"
              onClick={onShowEmojiPickerToggle}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>

            <button 
              className="text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" 
              disabled={true} 
              title="Fitur Lampirkan File belum tersedia"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>

            <input
              type="text"
              placeholder="Write a reply..."
              className="flex-1 rounded-full bg-gray-100 px-4 py-2 border-none focus:ring-red-500 focus:ring-1 text-xs disabled:opacity-75 transition-all outline-none"
              value={draftMessage}
              onChange={(e) => onDraftMessageChange(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isInputDisabled}
            />

            <button 
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50 p-2 transition-colors" 
              onClick={handleSend}
              disabled={!draftMessage.trim() || isInputDisabled}
              title="Kirim"
            >
              <Image
                src="/send.svg"
                alt="Kirim"
                width={20}
                height={20}
                className="opacity-70"
              />
            </button>
          </div>
        </div>
      </div>

      {showEmojiPicker && (
        <div 
          className="absolute z-20"
          style={{ bottom: '76px', left: '0px' }} 
        >
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            lazyLoadEmojis={true}
            height={350}
            width={300}
            searchDisabled
            skinTonesDisabled
          />
        </div>
      )}

    </div>
  );
};

export default ChatWindow;
