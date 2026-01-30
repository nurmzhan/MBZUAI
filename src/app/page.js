'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { 
  MapPin, Languages, Target, GraduationCap, Code, Mountain, Music, Grid3x3,
  Trophy, Medal, Award, Mic, FileText, Mail, Phone, Github, Linkedin,
  Briefcase, Users, BookOpen, Sparkles, ChevronDown, Menu, X
} from 'lucide-react'

// Sudoku Game Component
const SudokuGame = () => {
  const [board, setBoard] = useState([])
  const [solution, setSolution] = useState([])

  useEffect(() => {
    generateSudoku()
  }, [])

  const generateSudoku = () => {
    // Original field
    const field = '0681594327597283416342671589934157268278936145156842973729318654813465792465729831'
    
    // Create shuffled mapping array
    let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    for (let j = 0; j < 9; j++) {
      arr.push(arr.splice(Math.floor(Math.random() * arr.length), 1)[0])
    }
    
    // Generate board with random visibility
    const newBoard = []
    const newSolution = []
    
    for (let i = 1; i < 82; i++) {
      const value = arr[parseInt(field.substr(i, 1)) - 1]
      const isVisible = Math.random() * 10 > 5
      
      newBoard.push({
        value: isVisible ? value : 0,
        isInitial: isVisible,
        userValue: 0
      })
      newSolution.push(value)
    }
    
    setBoard(newBoard)
    setSolution(newSolution)
  }

  const handleCellChange = (index, value) => {
    if (board[index].isInitial) return
    
    const newValue = parseInt(value) || 0
    if (newValue >= 0 && newValue <= 9) {
      const newBoard = [...board]
      newBoard[index] = { ...newBoard[index], userValue: newValue }
      setBoard(newBoard)
    }
  }

  const checkSolution = () => {
    return board.every((cell, index) => {
      const cellValue = cell.isInitial ? cell.value : cell.userValue
      return cellValue === solution[index]
    })
  }

  const isComplete = board.length > 0 && board.every(cell => 
    (cell.isInitial && cell.value !== 0) || (!cell.isInitial && cell.userValue !== 0)
  ) && checkSolution()

  const handleReset = () => {
    generateSudoku()
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Sudoku Grid */}
      <div className="inline-block bg-black/50 p-4 rounded-xl border border-cyan-500/30">
        <table cellSpacing="0" className="border-collapse">
          <tbody>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
              <tr key={row}>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((col) => {
                  const index = row * 9 + col
                  const cell = board[index]
                  if (!cell) return null
                  
                  const isThickRight = (col + 1) % 3 === 0 && col !== 8
                  const isThickBottom = (row + 1) % 3 === 0 && row !== 8
                  
                  return (
                    <td key={index}
    className={`
  border border-gray-700 p-0
  ${isThickRight ? 'border-r-2 border-r-cyan-500/50' : ''}
  ${isThickBottom ? 'border-b-2 border-b-cyan-500/50' : ''}
`}>
  {cell.isInitial ? (
    <div className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center text-cyan-400 font-semibold bg-cyan-500/10 text-sm md:text-base">

                          {cell.value}
                        </div>
                      ) : (
                        <input
                          type="text"
                          maxLength="1"
                          value={cell.userValue || ''}
                          onChange={(e) => handleCellChange(index, e.target.value)}
                          onKeyDown={(e) => {
                            if (!/[1-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab') {
                              e.preventDefault()
                            }
                          }}
                           className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 text-sm md:text-base text-center bg-black/30 text-white font-semibold border-0 outline-none focus:bg-cyan-500/20 focus:ring-2 focus:ring-cyan-500"
                        />
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg font-semibold text-white transition-all"
        >
          New Game
        </motion.button>
      </div>

      {/* Completion Message */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="px-6 py-3 bg-green-500/20 border border-green-500/50 rounded-xl"
        >
          <p className="text-green-400 font-bold text-center">🎉 Perfect! You solved it! 🎉</p>
        </motion.div>
      )}
    </div>
  )
}

export default function Home() {
  const [scrollY, setScrollY] = useState(0)
  const [activeSection, setActiveSection] = useState('home')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [particles, setParticles] = useState([])

  useEffect(() => {
    // Initialize particles on client side only
    const newParticles = Array.from({ length: 20 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      targetX: Math.random() * window.innerWidth,
      targetY: Math.random() * window.innerHeight,
    }))
    setParticles(newParticles)

    const handleScroll = () => {
      setScrollY(window.scrollY)
      
      const sections = ['home', 'about', 'education', 'experience', 'skills', 'achievements', 'hobbies', 'contact']
      const current = sections.find(section => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })
      if (current) setActiveSection(current)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Education', href: '#education' },
    { name: 'Experience', href: '#experience' },
    { name: 'Skills', href: '#skills' },
    { name: 'Achievements', href: '#achievements' },
    { name: 'Hobbies', href: '#hobbies' },
    { name: 'Contact', href: '#contact' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f0f1e] to-[#0a0a0a]">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-black/80 backdrop-blur-lg shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold text-gradient"
            >
              NB
            </motion.div>
      
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  whileHover={{ scale: 1.1 }}
                  className={`text-sm font-medium transition-colors ${
                    activeSection === item.href.slice(1)
                      ? 'text-blue-500'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {item.name}
                </motion.a>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="md:hidden mt-4 pb-4 space-y-2"
      >
        {navItems.map((item) => (
          <a
            key={item.name}
            href={item.href}
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-4 py-2 rounded-lg transition-colors ${
              activeSection === item.href.slice(1)
                ? 'bg-blue-500/20 text-blue-400'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            {item.name}
          </a>
        ))}
      </motion.div>
    )}
  </div>
</motion.nav>

      {/* Hero Section */}
      {/* Hero Section */}
<section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden px-6 pt-20 md:pt-0">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((particle, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-500/30 rounded-full"
              initial={{ x: particle.x, y: particle.y }}
              animate={{
                x: [particle.x, particle.targetX, particle.x],
                y: [particle.y, particle.targetY, particle.y],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
  <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-8 md:gap-12">
    {/* Text Content */}
    <div className="flex-1 text-center md:text-left">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="text-6xl md:text-8xl font-bold mb-6"
          animate={{ 
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{ duration: 5, repeat: Infinity }}
          style={{
            backgroundImage: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)',
            backgroundSize: '200% 200%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Nurymzhan Baktygali
        </motion.h1>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-xl md:text-2xl text-gray-300 mb-4"
      >
        High School Leader & Future AI Innovator
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-lg text-gray-400 mb-12"
      >
        Aspiring BSc in Artificial Intelligence (Business) at MBZUAI
      </motion.p>

      <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.7 }}
  className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center md:justify-start"
>
        <motion.a
          href="#contact"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-full font-semibold transition-colors"
        >
          Get in Touch
        </motion.a>
        <motion.a
          href="#about"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 border-2 border-blue-600 hover:bg-blue-600/10 rounded-full font-semibold transition-colors"
        >
          Learn More
        </motion.a>
        <motion.a
    href="/cv.pdf"
    download="Nurymzhan_Baktygali_CV.pdf"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full font-semibold transition-colors flex items-center gap-2"
  >
    <FileText className="w-5 h-5" />
    Download CV
  </motion.a>
      </motion.div>
    </div>

    {/* Profile Photo */}
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      className="flex-shrink-0"
    >
      <div className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-3xl overflow-hidden border-4 border-blue-500/50 shadow-2xl shadow-blue-500/30">
        <img 
          src="/profile-photo.jpg" 
          alt="Nurymzhan Baktygali"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect fill="%230f172a" width="400" height="400"/><text x="50%" y="50%" fill="%233b82f6" font-size="120" text-anchor="middle" dy=".3em">NB</text></svg>';
          }}
        />
      </div>
    </motion.div>
  </div>
</div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
              <span className="text-gradient">About Me</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-12"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-8 rounded-2xl border border-blue-500/20 backdrop-blur-sm">
                <h3 className="text-2xl font-semibold mb-4 text-blue-400">Summary</h3>
                <p className="text-gray-300 leading-relaxed">
                  Motivated high school leader and volunteer tutor with experience in programming and analytics. 
                  As School President, led student-faculty initiatives; as an online tutor, supported rural students. 
                  Seeking BSc in Artificial Intelligence (Business) at MBZUAI to apply data-driven strategy for social 
                  and educational impact.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="space-y-4"
            >
              <motion.div variants={fadeInUp} className="bg-secondary/50 p-6 rounded-xl border border-gray-800 hover:border-blue-500/50 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <h4 className="font-semibold text-lg text-blue-400">Location</h4>
                </div>
                <p className="text-gray-300">Almaty, Kazakhstan</p>
              </motion.div>

              <motion.div variants={fadeInUp} className="bg-secondary/50 p-6 rounded-xl border border-gray-800 hover:border-blue-500/50 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <Languages className="w-5 h-5 text-purple-400" />
                  <h4 className="font-semibold text-lg text-purple-400">Languages</h4>
                </div>
                <p className="text-gray-300">English (Advanced), Kazakh (Native), Russian (Fluent)</p>
              </motion.div>

              <motion.div variants={fadeInUp} className="bg-secondary/50 p-6 rounded-xl border border-gray-800 hover:border-blue-500/50 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <Target className="w-5 h-5 text-green-400" />
                  <h4 className="font-semibold text-lg text-green-400">Goal</h4>
                </div>
                <p className="text-gray-300">BSc in AI (Business) at MBZUAI</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="py-20 px-6 bg-black/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
              <span className="text-gradient">Education</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-12"></div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-8"
          >
            {/* Gymnasium 27 */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-8 rounded-2xl border border-blue-500/20 backdrop-blur-sm"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <GraduationCap className="w-8 h-8 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-blue-400 mb-2">Gymnasium 27</h3>
                  <p className="text-gray-400 mb-2">Almaty, Kazakhstan</p>
                  <p className="text-purple-400 font-semibold">Diploma with Distinction</p>
                  <p className="text-sm text-gray-400">Expected June 2026</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <Award className="w-6 h-6 text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-400">GPA</p>
                    <p className="text-lg font-bold text-white">5.0 / 5.0</p>
                  </div>
                </div>
                
                <div className="p-3 bg-white/5 rounded-lg">
                  <p className="text-sm text-gray-400 mb-2">Program</p>
                  <p className="text-white">Trilingual academic track</p>
                  <p className="text-white">Advanced coursework in Mathematics, Physics and Geography</p>
                </div>
              </div>
            </motion.div>

            {/* Harvard CS50 */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-gradient-to-br from-red-500/10 to-orange-500/10 p-8 rounded-2xl border border-red-500/20 backdrop-blur-sm"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-red-500/20 rounded-lg">
                  <Code className="w-8 h-8 text-red-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-red-400 mb-2">Harvard University</h3>
                  <p className="text-gray-400 mb-2">Online Program</p>
                  <p className="text-orange-400 font-semibold">CS50: Introduction to Computer Science</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 bg-white/5 rounded-lg">
                  <p className="text-sm text-gray-400 mb-2">Key Topics</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm">C</span>
                    <span className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-sm">Python</span>
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm">Algorithms</span>
                    <span className="px-3 py-1 bg-pink-500/20 text-pink-300 rounded-full text-sm">Data Structures</span>
                  </div>
                </div>
                <div className="p-3 bg-white/5 rounded-lg">
    <p className="text-gray-300 text-sm leading-relaxed">
      Learned core computer science concepts, including programming, algorithms, and data structures, through Harvard's CS50 online course.
    </p>
  </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
              <span className="text-gradient">Experience</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-12"></div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-6"
          >
            {/* Work Experience */}
            <motion.div variants={fadeInUp} className="bg-gradient-to-r from-blue-500/10 to-transparent p-6 rounded-xl border-l-4 border-blue-500 hover:from-blue-500/20 transition-all">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-blue-400">Website Developer</h3>
                  <p className="text-gray-300">Russell ISC</p>
                </div>
                <span className="text-sm text-gray-400 mt-2 md:mt-0">Jul 2025 — Jan 2026</span>
              </div>
              <ul className="space-y-2 text-gray-300">
                <li>• Developed and launched school websites for academic programs and events</li>
                <li>• Implemented analytics tools to monitor traffic and user engagement</li>
                <li>• Supported IT ops & digital infrastructure across departments</li>
              </ul>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-gradient-to-r from-purple-500/10 to-transparent p-6 rounded-xl border-l-4 border-purple-500 hover:from-purple-500/20 transition-all">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-purple-400">School President</h3>
                  <p className="text-gray-300">Gymnasium 27</p>
                </div>
                <span className="text-sm text-gray-400 mt-2 md:mt-0">Sep 2025 — Present</span>
              </div>
              <ul className="space-y-2 text-gray-300">
                <li>• Led student forums to collect feedback on academics, school life, and well-being</li>
                <li>• Worked with administration to implement exam support sessions and facility improvements</li>
                <li>• Organized school-wide events to strengthen student engagement</li>
                <li>• Created student-led initiative formats, enabling peers to design and run projects</li>
              </ul>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-gradient-to-r from-pink-500/10 to-transparent p-6 rounded-xl border-l-4 border-pink-500 hover:from-pink-500/20 transition-all">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-pink-400">Website Developer</h3>
                  <p className="text-gray-300">Narxoz University Finance Club</p>
                </div>
                <span className="text-sm text-gray-400 mt-2 md:mt-0">Jun 2024 — Aug 2024</span>
              </div>
              <ul className="space-y-2 text-gray-300">
                <li>• Improved website structure, usability, and responsiveness</li>
                <li>• Implemented front-end features and resolved technical issues</li>
                <li>• Collaborated with team members to meet project deadlines</li>
              </ul>
            </motion.div>

            {/* Volunteering */}
            <motion.div variants={fadeInUp} className="bg-gradient-to-r from-green-500/10 to-transparent p-6 rounded-xl border-l-4 border-green-500 hover:from-green-500/20 transition-all">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-green-400">Curator - Kazakh Language Club TIL</h3>
                  <p className="text-gray-300">Mentoring and Tutoring</p>
                </div>
                <span className="text-sm text-gray-400 mt-2 md:mt-0">Dec 2024 — May 2025</span>
              </div>
              <ul className="space-y-2 text-gray-300">
                <li>• Conducted supplementary classes for junior students</li>
                <li>• Designed lesson plans and monitored learning progress</li>
                <li>• Encouraged participation through interactive activities</li>
              </ul>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-gradient-to-r from-yellow-500/10 to-transparent p-6 rounded-xl border-l-4 border-yellow-500 hover:from-yellow-500/20 transition-all">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-yellow-400">Online English Tutor</h3>
                  <p className="text-gray-300">Rural School Students</p>
                </div>
                <span className="text-sm text-gray-400 mt-2 md:mt-0">Jan 2025 — Mar 2025</span>
              </div>
              <ul className="space-y-2 text-gray-300">
                <li>• Provided free online English lessons to two students from a rural school in Abay region</li>
                <li>• Designed personalized study plans based on individual needs</li>
                <li>• Organized practice sessions to build confidence and fluency</li>
              </ul>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-gradient-to-r from-indigo-500/10 to-transparent p-6 rounded-xl border-l-4 border-indigo-500 hover:from-indigo-500/20 transition-all">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-indigo-400">Leader - School Parliamentary Faction</h3>
                  <p className="text-gray-300">Gymnasium 27</p>
                </div>
                <span className="text-sm text-gray-400 mt-2 md:mt-0">Sep 2023 — Jun 2025</span>
              </div>
              <ul className="space-y-2 text-gray-300">
                <li>• Collected and analyzed student feedback via surveys and meetings</li>
                <li>• Developed proposals and presented them to school leadership</li>
                <li>• Moderated sessions, coordinated initiatives, and ensured follow-up</li>
                <li>• Acted as liaison between students and teachers</li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
              <span className="text-gradient">Skills</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-12"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Tech Skills */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-8 rounded-2xl border border-blue-500/20"
            >
              <div className="flex items-center gap-3 mb-6">
                <Code className="w-6 h-6 text-blue-400" />
                <h3 className="text-2xl font-bold text-blue-400">Tech Skills</h3>
              </div>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-3"
              >
                {[
                  'Python, C, HTML',
                  'Google Analytics',
                  'Website Development',
                  'Project & collaboration tools (Notion, Miro, Trello)',
                  'Microsoft Office Suite',
                ].map((skill, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    whileHover={{ x: 10 }}
                    className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-300">{skill}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Core Skills */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-8 rounded-2xl border border-purple-500/20"
            >
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-6 h-6 text-purple-400" />
                <h3 className="text-2xl font-bold text-purple-400">Core Skills</h3>
              </div>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-3"
              >
                {[
                  'Student leadership & stakeholder communication',
                  'Academic tutoring & mentoring',
                  'Lesson design and learning support planning',
                  'Project coordination & initiative execution',
                  'Event planning & community engagement',
                ].map((skill, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    whileHover={{ x: 10 }}
                    className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-300">{skill}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section id="achievements" className="py-20 px-6 bg-black/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
              <span className="text-gradient">Achievements</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-12"></div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 [&>*:last-child]:md:col-start-2 [&>*:last-child]:lg:col-start-2"
          >
            {[
              { Icon: Trophy, title: '1st Place', desc: 'National Mathematics Competition "Kangaroo"', color: 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30', iconColor: 'text-yellow-400' },
              { Icon: Award, title: 'Best Graduate', desc: 'Awarded Best Gymnasium Graduate by School Administration', color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30', iconColor: 'text-blue-400' },
              { Icon: Medal, title: '2nd Place', desc: 'District Math Olympiad (Grade 10)', color: 'from-gray-400/20 to-gray-500/20 border-gray-400/30', iconColor: 'text-gray-400' },
              { Icon: Medal, title: '3rd Place', desc: 'District Math Olympiad (Grade 11)', color: 'from-orange-500/20 to-red-500/20 border-orange-500/30', iconColor: 'text-orange-400' },
              { Icon: Mic, title: 'Semifinalist', desc: 'City-Level Interschool Debate Tournament', color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30', iconColor: 'text-purple-400' },
              { Icon: Grid3x3, title: 'Top 1% Sudoku Worldwide', desc: 'Best time solving Sudoku worldwide in Expert, Hard, and Easy modes', color: 'from-cyan-500/20 to-teal-500/20 border-cyan-500/30', iconColor: 'text-cyan-400' },
            ].map((achievement, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`bg-gradient-to-br ${achievement.color} p-6 rounded-xl border backdrop-blur-sm`}
              >
                <div className="mb-4">
                  <achievement.Icon className={`w-10 h-10 ${achievement.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">{achievement.title}</h3>
                <p className="text-gray-300 text-sm">{achievement.desc}</p>
              </motion.div>
            ))}
            
            {/* Test Results Card */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-green-500/20 to-teal-500/20 border border-green-500/30 p-6 rounded-xl backdrop-blur-sm"
            >
              <div className="mb-4">
                <FileText className="w-10 h-10 text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Test Results</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">SAT (Superscore):</span>
                  <span className="text-green-400 font-semibold">1500</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">UNT (Unified National):</span>
                  <span className="text-green-400 font-semibold">122/140</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">IELTS:</span>
                  <span className="text-green-400 font-semibold">7.5</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Hobbies Section */}
      <section id="hobbies" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
              <span className="text-gradient">My Hobbies</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-12"></div>
          </motion.div>

          <div className="space-y-12">
            {/* Parkour */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="bg-gradient-to-br from-red-500/10 to-orange-500/10 p-8 rounded-2xl border border-red-500/20"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-red-500/20 rounded-lg">
                  <Sparkles className="w-10 h-10 text-red-400" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-red-400">Parkour</h3>
                  <p className="text-gray-400">Freedom of movement</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {/* Место для видео паркура */}
                <div className="aspect-video bg-black/30 rounded-xl border border-red-500/30 flex items-center justify-center overflow-hidden">
                  {/* Замени src на путь к твоему видео */}
                  <video 
                    className="w-full h-full object-cover"
                    controls
                    poster="/parkour-thumbnail.jpg"
                  >
                    <source src="/parkour-video.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                
                <div className="aspect-video bg-black/30 rounded-xl border border-red-500/30 flex items-center justify-center overflow-hidden">
                  <video 
                    className="w-full h-full object-cover"
                    controls
                    poster="/parkour-thumbnail-2.jpg"
                  >
                    <source src="/parkour-video-2.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
              
              <p className="text-gray-300 mt-4">
                Parkour teaches me discipline, courage, and creative problem-solving - skills that translate directly to overcoming challenges in life and work.
              </p>
            </motion.div>

            {/* Hiking */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-8 rounded-2xl border border-green-500/20"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <Mountain className="w-10 h-10 text-green-400" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-green-400">Hiking</h3>
                  <p className="text-gray-400">Exploring the mountains of Kazakhstan</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                {/* Места для фото хайкинга */}
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="aspect-square bg-black/30 rounded-xl border border-green-500/30 overflow-hidden"
                >
                  {/* Замени src на путь к твоим фото */}
                  <img 
                    src="/hiking-1.jpg" 
                    alt="Hiking adventure 1"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-500">Add photo 1</div>';
                    }}
                  />
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="aspect-square bg-black/30 rounded-xl border border-green-500/30 overflow-hidden"
                >
                  <img 
                    src="/hiking-2.jpg" 
                    alt="Hiking adventure 2"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-500">Add photo 2</div>';
                    }}
                  />
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="aspect-square bg-black/30 rounded-xl border border-green-500/30 overflow-hidden"
                >
                  <img 
                    src="/hiking-3.jpg" 
                    alt="Hiking adventure 3"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-500">Add photo 3</div>';
                    }}
                  />
                </motion.div>
              </div>
              
              <p className="text-gray-300 mt-4">
                Hiking through Kazakhstan's beautiful landscapes helps me clear my mind, gain perspective, and appreciate the beauty of nature.
              </p>
            </motion.div>

            {/* Ukulele */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-8 rounded-2xl border border-purple-500/20"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <Music className="w-10 h-10 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-purple-400">Ukulele</h3>
                  <p className="text-gray-400">Making music in my free time</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {/* Место для видео укулеле */}
                <div className="aspect-video bg-black/30 rounded-xl border border-purple-500/30 flex items-center justify-center overflow-hidden">
                  <video 
                    className="w-full h-full object-cover"
                    controls
                    poster="/ukulele-thumbnail.jpg"
                  >
                    <source src="/ukulele-video.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                
                <div className="aspect-video bg-black/30 rounded-xl border border-purple-500/30 flex items-center justify-center overflow-hidden">
                  <video 
                    className="w-full h-full object-cover"
                    controls
                    poster="/ukulele-thumbnail-2.jpg"
                  >
                    <source src="/ukulele-video-2.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
              
              <p className="text-gray-300 mt-4">
                Playing ukulele is my creative outlet - it helps me relax, express emotions, and brings joy to those around me.
              </p>
            </motion.div>

            {/* Sudoku */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-8 rounded-2xl border border-cyan-500/20"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-cyan-500/20 rounded-lg">
                  <Grid3x3 className="w-10 h-10 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-cyan-400">Sudoku</h3>
                  <p className="text-gray-400">Fill the grid with numbers 1-9</p>
                </div>
              </div>
              
              <SudokuGame />
              
              <p className="text-gray-300 mt-4">
                Sudoku challenges my logical thinking and problem-solving skills. It's a perfect way to keep my mind sharp and focused.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
              <span className="text-gradient">Get In Touch</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-12"></div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6"
          >
            <motion.a
              variants={fadeInUp}
              href="mailto:baktygali.nurymzhan@gmail.com"
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-8 rounded-xl border border-blue-500/20 text-center hover:border-blue-500/50 transition-all"
            >
              <div className="flex justify-center mb-4">
                <Mail className="w-12 h-12 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-blue-400">Email</h3>
              <p className="text-gray-300 text-sm break-all">baktygali.nurymzhan@gmail.com</p>
            </motion.a>

            <motion.a
              variants={fadeInUp}
              href="tel:+77475536232"
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-8 rounded-xl border border-purple-500/20 text-center hover:border-purple-500/50 transition-all"
            >
              <div className="flex justify-center mb-4">
                <Phone className="w-12 h-12 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-purple-400">Phone</h3>
              <p className="text-gray-300 text-sm">+7 747 553 62 32</p>
            </motion.a>

            <motion.div
              variants={fadeInUp}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-pink-500/10 to-red-500/10 p-8 rounded-xl border border-pink-500/20 text-center"
            >
              <div className="flex justify-center mb-4">
                <MapPin className="w-12 h-12 text-pink-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-pink-400">Location</h3>
              <p className="text-gray-300 text-sm">Almaty, Kazakhstan</p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <p className="text-gray-400 mb-6">
              I'm currently seeking opportunities to pursue BSc in Artificial Intelligence (Business) at MBZUAI. 
              Feel free to reach out!
            </p>
            <motion.a
              href="mailto:baktygali.nurymzhan@gmail.com"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full font-semibold transition-all"
            >
              Send a Message
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center text-gray-400">
          <p>© 2026 Nurymzhan Baktygali. Built with Next.js & Framer Motion.</p>
        </div>
      </footer>
    </div>
  )
}