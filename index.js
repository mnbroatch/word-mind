import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './app.js'

import './styles.scss'
import 'react-dialogue-tree/dist/react-dialogue-tree.css'

createRoot(document.getElementById('root')).render(<App />)
