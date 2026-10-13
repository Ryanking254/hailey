import './style.css'

// ---------- Page navigation ----------
const pages = document.querySelectorAll('.page')

function goTo(id) {
  // Park the runaway button back home whenever we navigate,
  // so it never lingers floating over other pages
  resetNoButton()
  pages.forEach((p) => p.classList.toggle('active', p.id === id))
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

document.querySelectorAll('[data-go]').forEach((el) => {
  el.addEventListener('click', () => goTo(el.dataset.go))
})

// ---------- Typewriter intro ----------
const loveLine = 'I made something small, just for you… 💌'
const tw = document.getElementById('typewriter')
let ci = 0
function type() {
  if (ci <= loveLine.length) {
    tw.textContent = loveLine.slice(0, ci)
    ci++
    setTimeout(type, 55)
  }
}
type()

// ---------- Floating hearts background ----------
const heartsBg = document.getElementById('hearts-bg')
const HEARTS = ['❤️', '💖', '💕', '💗', '🌸', '✨']
function spawnHeart() {
  const h = document.createElement('span')
  h.className = 'float-heart'
  h.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)]
  h.style.left = Math.random() * 100 + 'vw'
  h.style.fontSize = 12 + Math.random() * 26 + 'px'
  h.style.animationDuration = 6 + Math.random() * 7 + 's'
  heartsBg.appendChild(h)
  setTimeout(() => h.remove(), 14000)
}
setInterval(spawnHeart, 700)
for (let i = 0; i < 12; i++) setTimeout(spawnHeart, i * 200)

// ---------- Video placeholder ----------
const video = document.getElementById('love-video')
const placeholder = document.getElementById('video-placeholder')

function hidePlaceholder() {
  placeholder.classList.add('hidden')
}

function showPlaceholder() {
  placeholder.classList.remove('hidden')
}

// Hide overlay as soon as any real video data can play
video.addEventListener('loadeddata', hidePlaceholder)
video.addEventListener('canplay', hidePlaceholder)
// If the file 404s (e.g. stale Vercel deployment), keep overlay visible
video.addEventListener('error', showPlaceholder, true)
video.querySelector('source')?.addEventListener('error', showPlaceholder)
// In case the video was already cached/loaded before listeners attached
if (video.readyState >= 2) hidePlaceholder()
// Clicking the placeholder tries to play (will fail gracefully until replaced)
placeholder.addEventListener('click', () => video.play?.().catch(() => {}))

// Pause video when leaving the video page
document.querySelectorAll('[data-go]').forEach((el) => {
  el.addEventListener('click', () => {
    if (el.dataset.go !== 'page-video' && !video.paused) video.pause()
  })
})

// ---------- Runaway "No" button (roams the whole screen — no box) ----------
const btnNo = document.getElementById('btn-no')
const btnYes = document.getElementById('btn-yes')
const tease = document.getElementById('no-tease')

const teases = [
  'Nope, try again 😏',
  'The "no" button is shy 🙈',
  'Too slow! 💨',
  'Hmm, that button keeps moving 🤔',
  'Are you sure? Really sure? 🥺',
  'Okay this is getting silly 😂',
  'Just click Yes already ❤️',
  'Wow, you\'re persistent 😅',
  'That button has cardio 🏃‍♀️💨',
  'Nope-ity nope nope 🙅‍♀️',
  'Have you considered… Yes? 😇',
  'The universe says try again 🌌',
]

let lastTease = -1
function nextTease() {
  // Always pick a different line so it changes on EVERY shift
  let i
  do {
    i = Math.floor(Math.random() * teases.length)
  } while (i === lastTease)
  lastTease = i
  tease.textContent = teases[i]
}

let noCount = 0
let yesScale = 1

function resetNoButton() {
  btnNo.style.left = ''
  btnNo.style.top = ''
  btnNo.style.transform = ''
  btnNo.style.position = ''
  btnNo.style.scale = ''
  noCount = 0
  yesScale = 1
  lastTease = -1
  btnYes.style.transform = ''
  btnYes.classList.remove('grow')
  tease.textContent = 'Choose wisely… 😏'
}

function moveNoButton() {
  // Dodge anywhere on the whole screen (not confined to any box)
  const noRect = btnNo.getBoundingClientRect()
  const pad = 12

  const maxX = Math.max(window.innerWidth - noRect.width - pad * 2, 0)
  const maxY = Math.max(window.innerHeight - noRect.height - pad * 2, 0)

  const x = pad + Math.random() * maxX
  const y = pad + Math.random() * maxY

  btnNo.style.position = 'fixed'
  btnNo.style.left = x + 'px'
  btnNo.style.top = y + 'px'
  btnNo.style.transform = 'none'
  btnNo.style.margin = '0'

  noCount++
  nextTease()

  // Every dodge makes YES a little bigger — irresistible 😄
  yesScale = Math.min(yesScale + 0.12, 1.9)
  btnYes.classList.add('grow')
  btnYes.style.transform = `scale(${yesScale})`

  // After many attempts, the No button shrinks away
  if (noCount >= 6) {
    btnNo.style.scale = String(Math.max(1 - (noCount - 5) * 0.15, 0.4))
  }
}

// Desktop: dodge when the cursor gets close
btnNo.addEventListener('mouseover', moveNoButton)
// Mobile: dodge on touch before a tap can land
btnNo.addEventListener('touchstart', (e) => {
  e.preventDefault()
  moveNoButton()
}, { passive: false })
btnNo.addEventListener('click', (e) => {
  e.preventDefault()
  moveNoButton()
})
// Extra mischief: dodge when the cursor gets near the button, anywhere on the page (desktop)
document.addEventListener('pointermove', (e) => {
  if (e.pointerType !== 'mouse') return
  if (!document.getElementById('page-question').classList.contains('active')) return
  const r = btnNo.getBoundingClientRect()
  const dx = e.clientX - (r.left + r.width / 2)
  const dy = e.clientY - (r.top + r.height / 2)
  if (Math.hypot(dx, dy) < 100) moveNoButton()
})

// ---------- YES! Celebration ----------
const confettiBox = document.getElementById('confetti-canvas')
const CONFETTI = ['❤️', '💖', '🎉', '✨', '💕', '🌸', '🥰']

function confettiBurst(n = 80) {
  for (let i = 0; i < n; i++) {
    const c = document.createElement('span')
    c.className = 'confetti-piece'
    c.textContent = CONFETTI[Math.floor(Math.random() * CONFETTI.length)]
    c.style.left = Math.random() * 100 + 'vw'
    c.style.fontSize = 12 + Math.random() * 24 + 'px'
    c.style.animationDuration = 2 + Math.random() * 2.5 + 's'
    c.style.animationDelay = Math.random() * 0.6 + 's'
    confettiBox.appendChild(c)
    setTimeout(() => c.remove(), 6000)
  }
}

btnYes.addEventListener('click', () => {
  document.getElementById('ticket-date').textContent =
    '💍 ' + new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
  goTo('page-yes')
  confettiBurst(120)
  setTimeout(() => confettiBurst(60), 1200)
})

document.getElementById('btn-celebrate').addEventListener('click', () => confettiBurst(120))

// ---------- CD player: "Twilight" by Evan (intro page) ----------
const cdBtn = document.getElementById('cd-btn')
const cdSide = document.querySelector('.cd-corner')
const cdIcon = document.getElementById('cd-icon')
const cdHint = document.getElementById('cd-hint')
const song = document.getElementById('bg-song')

const MISSING_SONG_MSG = '🎵 drop twilight-evan.mp3 into the /public folder to enable the song'

song.addEventListener('play', () => {
  cdBtn.classList.add('playing')
  cdSide.classList.add('playing')
  cdIcon.textContent = '⏸'
  cdHint.textContent = 'now playing 🎶 tap to pause'
})

song.addEventListener('pause', () => {
  cdBtn.classList.remove('playing')
  cdSide.classList.remove('playing')
  cdIcon.textContent = '▶'
  cdHint.textContent = 'paused — tap to play ▶'
})

cdBtn.addEventListener('click', async () => {
  if (song.paused) {
    try {
      await song.play()
    } catch {
      // File missing or format unsupported — tell him how to add it
      cdHint.textContent = MISSING_SONG_MSG
    }
  } else {
    song.pause()
  }
})
