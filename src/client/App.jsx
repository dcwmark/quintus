// src/client/App.jsx

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mic, 
  // MicOff, 
  Send, 
  Bot, 
  User, 
  // Volume2, 
  Square,
  Loader2,
  FileText,
  Search,
  Brain,
  Users
} from 'lucide-react'
import axios from 'axios'

import "./App.css";

const AGENTS = {
  RESEARCHER: { name: 'Researcher', icon: Search, color: 'text-blue-500' },
  ANALYZER: { name: 'Analyzer', icon: Brain, color: 'text-purple-500' },
  SYNTHESIZER: { name: 'Synthesizer', icon: FileText, color: 'text-green-500' },
  COORDINATOR: { name: 'Coordinator', icon: Users, color: 'text-orange-500' }
};

const App = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [messages, setMessages] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentAgent, setCurrentAgent] = useState(null)
  const [agentProgress, setAgentProgress] = useState({})

  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const startRecording = async () => {
    try {
      const stream = await navigator
                            .mediaDevices
                            .getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(
          audioChunksRef.current, { type: 'audio/wav' })
        await transcribeAudio(audioBlob)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error starting recording:', error)
      alert('Error accessing microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const transcribeAudio = async (audioBlob) => {
    setIsProcessing(true)
    const formData = new FormData()
    formData.append('audio', audioBlob)

    try {
      const response = await axios.post('/api/transcribe', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      const transcribedText = response.data.text
      setTranscript(transcribedText)
      
      if (transcribedText.trim()) {
        await processQuery(transcribedText)
      }
    } catch (error) {
      console.error('Transcription error:', error)
      setMessages(prev => [...prev, {
        type: 'error',
        content: 'Failed to transcribe audio. Please try again.',
        timestamp: new Date()
      }])
    } finally {
      setIsProcessing(false)
    }
  }

  const processQuery = async (query) => {
    const userMessage = {
      type: 'user',
      content: query,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setTranscript('')
    
    try {
      // Start WebSocket connection for real-time agent updates
      const ws = new WebSocket(`ws://localhost:5000`)
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        
        if (data.type === 'agent_start') {
          setCurrentAgent(data.agent)
          setAgentProgress(prev => ({
            ...prev,
            [data.agent]: { status: 'active', progress: 0 }
          }))
        } else if (data.type === 'agent_progress') {
          setAgentProgress(prev => ({
            ...prev,
            [data.agent]: { 
              ...prev[data.agent],
              progress: data.progress,
              status: data.status 
            }
          }))
        } else if (data.type === 'agent_complete') {
          setAgentProgress(prev => ({
            ...prev,
            [data.agent]: { status: 'complete', progress: 100 }
          }))
        }
      }

      const response = await axios.post('/api/query', { query })
      
      ws.close()
      setCurrentAgent(null)
      setAgentProgress({})
      
      const botMessage = {
        type: 'bot',
        content: response.data.response,
        sources: response.data.sources || [],
        agents_used: response.data.agents_used || [],
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
      
      // Text-to-speech for the response
      if (response.data.response) {
        speakText(response.data.response)
      }
      
    } catch (error) {
      console.error('Query processing error:', error)
      setMessages(prev => [...prev, {
        type: 'error',
        content: 'Failed to process query. Please try again.',
        timestamp: new Date()
      }])
      setCurrentAgent(null)
      setAgentProgress({})
    }
  }

  const speakText = async (text) => {
    try {
      const response = await axios.post('/api/speak', { text }, {
        responseType: 'blob'
      })
      
      const audioBlob = new Blob([response.data], { type: 'audio/mpeg' })
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)
      audio.play()
    } catch (error) {
      console.error('Text-to-speech error:', error)
    }
  }

  const handleSendText = () => {
    if (transcript.trim()) {
      processQuery(transcript)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendText()
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <Bot className="logo-icon" />
            <h1>Quintus</h1>
          </div>
          
          {currentAgent && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="current-agent"
            >
              <div className="agent-info">
                {React.createElement(AGENTS[currentAgent]?.icon || Bot, {
                  className: `agent-icon ${AGENTS[currentAgent]?.color || 'text-gray-500'}`
                })}
                <span>{AGENTS[currentAgent]?.name || currentAgent} is working...</span>
              </div>
              <div className="agent-progress">
                <div 
                  className="progress-bar"
                  style={{ width: `${agentProgress[currentAgent]?.progress || 0}%` }}
                />
              </div>
            </motion.div>
          )}
        </div>
      </header>

      <main className="chat-container">
        <div className="messages">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`message ${message.type}`}
              >
                <div className="message-avatar">
                  {message.type === 'user' ? <User /> : <Bot />}
                </div>
                <div className="message-content">
                  <div className="message-text">{message.content}</div>
                  
                  {message.agents_used && message.agents_used.length > 0 && (
                    <div className="agents-used">
                      <span className="agents-label">Agents consulted:</span>
                      {message.agents_used.map((agent, idx) => (
                        <span key={idx} className="agent-tag">
                          {React.createElement(AGENTS[agent]?.icon || Bot, {
                            className: "agent-tag-icon"
                          })}
                          {AGENTS[agent]?.name || agent}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {message.sources && message.sources.length > 0 && (
                    <div className="sources">
                      <span className="sources-label">Sources:</span>
                      {message.sources.map((source, idx) => (
                        <div key={idx} className="source-item">
                          <FileText className="source-icon" />
                          <span>{source}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="message-timestamp">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="processing-indicator"
            >
              <Loader2 className="spinning" />
              <span>Processing your request...</span>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="input-container">
          <div className="input-wrapper">
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything or use voice input..."
              disabled={isRecording || isProcessing}
              className="text-input"
            />
            
            <div className="input-controls">
              <button
                onClick={handleSendText}
                disabled={!transcript.trim() || isRecording || isProcessing}
                className="send-button"
              >
                <Send />
              </button>
              
              <button
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onTouchStart={startRecording}
                onTouchEnd={stopRecording}
                disabled={isProcessing}
                className={`record-button ${isRecording ? 'recording' : ''}`}
              >
                {isRecording ? <Square /> : <Mic />}
              </button>
            </div>
          </div>
          
          <div className="input-hint">
            {isRecording ? 'Release to stop recording' : 'Hold to record, or type your message'}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
