# VEIL Security Dashboard - Feature Documentation

## Overview

The VEIL Security Dashboard is a real-time security command center for monitoring AI agent activity, network threats, and system health. Built with React, TypeScript, and Tailwind CSS with a glassmorphism design aesthetic.

---

## 🏗️ Layout Components

### DashboardLayout
The main shell that wraps all dashboard content.

**Features:**
- **Collapsible Sidebar**: Click the logo or collapse button to toggle between expanded (240px) and collapsed (72px) states. Uses Framer Motion for smooth spring animation.
- **Sticky Header**: Always visible at top with blur backdrop effect (`backdrop-blur-xl`).
- **Animated Background**: Two large gradient orbs (cyan and purple) with blur effects create depth and visual interest.
- **Grid Pattern Overlay**: Subtle 40px grid adds texture without distraction.

**Navigation Items:**
| Icon | Label | Route | Purpose |
|------|-------|-------|---------|
| LayoutDashboard | Command | `/` | Main dashboard view |
| Shield | Policies | `/policies` | Security policy management |
| Activity | Analytics | `/analytics` | Traffic and threat analytics |
| Database | Ledger | `/logs` | Audit log viewer |
| Terminal | Terminal | `/terminal` | CLI interface (placeholder) |
| Settings | Settings | `/settings` | System configuration |

---

### Header
Top navigation bar with system status and user controls.

**Components:**
1. **System Status Badge**
   - Green pulsing dot indicates "System Online"
   - Text shows current status
   - Background uses emerald color with transparency

2. **Breadcrumb Navigation**
   - Shows current page location
   - Format: `Dashboard / Overview`

3. **Global Search**
   - Placeholder text: "Search IPs, Agents, Threats..."
   - Shows keyboard shortcut hint (⌘K)
   - Glass-style input with blur background
   - *Currently visual only - no search logic implemented*

4. **Notification Bell**
   - Shows unread count badge (red dot)
   - Hover state with background highlight

5. **User Profile**
   - Displays user name and role
   - Avatar with gradient background

---

## 📊 Dashboard Components

### MetricTicker (KPI Strip)
Horizontal row of key performance indicators at the top of the dashboard.

**Metrics Displayed:**

| Metric | Description | Example Value | Status Logic |
|--------|-------------|---------------|--------------|
| **Risk Score** | Overall system risk (0-100 scale) | 23 | <30 = good, 30-70 = warning, >70 = critical |
| **Active Threats** | Number of live threats being tracked | 0 | 0 = good, 1-5 = warning, >5 = critical |
| **Block Rate** | Percentage of requests being blocked | 4.2% | <5% = good, 5-15% = warning, >15% = critical |
| **MTTD** | Mean Time to Detect threats | 14ms | <20ms = good, 20-50ms = warning, >50ms = critical |
| **Network Load** | Current data throughput | 1.2GB/s | Informational only (neutral status) |

**Visual Features:**
- Glass card styling with translucent background
- Status-based border colors and glow effects
- Trend arrows (up/down) with percentage change
- Icons for each metric type
- Responsive horizontal scroll on mobile

---

### ThreatMap (Global Threat Visualization)
Full-width world map showing geographic distribution of detected threats.

**Features:**

1. **Map Background**
   - Simplified SVG continent outlines
   - Grid overlay pattern (40px squares)
   - Gradient from slate-900 to slate-950

2. **Threat Dots**
   - Appear at random geographic positions
   - Three severity levels with distinct colors:
     - **Low (Cyan)**: Minor anomalies, reconnaissance attempts
     - **Medium (Amber)**: Suspicious activity, policy violations
     - **High (Rose)**: Active attacks, critical threats
   - Pulsing animation ring around each dot
   - Fade in with `animate-fade-in`

3. **Auto-Refresh**
   - New threats appear every 2.5 seconds
   - Old threats (>10 seconds) automatically removed
   - Maximum 15 threats displayed at once

4. **Legend**
   - Color-coded severity indicators in header
   - Shows what each color represents

5. **Stats Overlay**
   - Active threat count badge
   - Last updated timestamp

---

### TrendCharts (Traffic Analytics)
Bar chart visualization of request volume and blocked traffic over 24 hours.

**Features:**

1. **Bar Chart**
   - 24 bars representing each hour
   - Two data series:
     - **Requests** (cyan-to-blue gradient): Total incoming requests
     - **Blocked** (rose-to-orange gradient): Requests that were blocked
   - Height scaled relative to maximum value

2. **Interactive Tooltips**
   - Hover over any bar to see exact values
   - Shows hour, request count, and blocked count
   - Glass card styling on tooltip

3. **Summary Statistics**
   - Total requests for the day
   - Total blocked requests
   - Trend indicator (e.g., "+12% vs yesterday")

4. **Auto-Update**
   - Data shifts left every 30 seconds
   - New hour data appended

---

### LayerHealth (Protocol Stack Monitor)
Vertical list showing the health status of each security layer in the VEIL system.

**Security Layers:**

| Layer | Name | Description |
|-------|------|-------------|
| L0 | Smart Valve | Initial request gating and throttling |
| L1 | Firewall | IP filtering and basic rule blocking |
| L2 | Rate Limiter | Request rate enforcement per agent |
| L3 | Anomaly Detector | ML-based unusual pattern detection |
| L4 | AI Judge | LLM-powered intent analysis and decision |
| L5 | Ledger | Immutable audit log storage |

**Status Indicators:**
| Status | Icon | Color | Meaning |
|--------|------|-------|---------|
| Active | ShieldCheck | Emerald | Layer functioning normally |
| Degraded | AlertTriangle | Amber | Reduced performance or partial failure |
| Offline | XOctagon | Rose | Layer completely non-functional |

**Visual Elements:**
- Health percentage bar (gradient based on value)
- Latency display in milliseconds
- Hover state highlighting
- Layer ID label (L0, L1, etc.)

---

### LiveFeed (Security Audit Log)
Real-time stream of security events in a terminal-style interface.

**Log Entry Fields:**

| Column | Description | Example |
|--------|-------------|---------|
| TIME | Timestamp of event | 14:32:05 |
| STS | Allow/Block verdict | ALLOW / BLOCK |
| MTH | HTTP method | GET, POST, PUT, DELETE |
| PATH | Request endpoint | /api/users |
| SOURCE | Originating IP address | 192.168.1.45 |
| SIZE | Response size | 342B |

**Controls:**
1. **Play/Pause Button**: Toggle real-time updates
2. **Filter Button**: *Visual only - filtering not implemented*
3. **Expand Button**: *Visual only - full-screen not implemented*

**Visual Features:**
- macOS-style traffic light dots in header
- Sticky table header during scroll
- Color-coded status badges (green allow, red block)
- Alternating row hover states
- Monospace font for data fields

**Data Flow:**
- New events every 2 seconds when not paused
- Maximum 20 events displayed (oldest removed)
- Events prepend to top of list

---

## 🎨 Design System

### Color Palette

**Backgrounds:**
- Base: `#0a0a0f` (near-black)
- Elevated: `#12121a` (slightly lighter)
- Glass: `rgba(15, 15, 25, 0.7)` (translucent)

**Accents:**
- Cyan: `#22d3ee` (primary actions, info)
- Blue: `#3b82f6` (links, interactive)
- Purple: `#a855f7` (special highlights)
- Green: `#22c55e` (success, allow, active)
- Amber: `#f59e0b` (warning, caution)
- Red: `#ef4444` (error, block, critical)

### Typography
- **Primary Font**: Inter (UI text)
- **Monospace**: JetBrains Mono (data, code, timestamps)

### Glass Effects
- `backdrop-blur-xl` (20px blur)
- `bg-white/5` to `bg-white/10` (translucent white)
- `border-white/10` (subtle borders)

---

## 📁 File Structure

```
frontend/
├── components/
│   ├── layout/
│   │   └── DashboardLayout.tsx    # Main layout shell
│   ├── dashboard/
│   │   ├── MetricTicker.tsx       # KPI cards strip
│   │   ├── ThreatMap.tsx          # Global threat map
│   │   ├── TrendCharts.tsx        # Traffic bar charts
│   │   ├── LayerHealth.tsx        # Security layer status
│   │   └── LiveFeed.tsx           # Audit log terminal
│   └── DashboardPage.tsx          # Page assembly
├── styles.css                      # Global styles + glass utilities
└── tailwind.config.js             # Color tokens
```

---

## 🔌 Backend Integration Points

**Currently using mock data. Future API endpoints needed:**

| Endpoint | Component | Data |
|----------|-----------|------|
| `GET /api/metrics` | MetricTicker | Risk score, threats, MTTD |
| `GET /api/threats` | ThreatMap | Active threat locations |
| `GET /api/traffic` | TrendCharts | Hourly request/block counts |
| `GET /api/layers` | LayerHealth | Layer status and latency |
| `WS /api/logs` | LiveFeed | Real-time log stream |

---

## ⌨️ Keyboard Shortcuts (Planned)

| Shortcut | Action |
|----------|--------|
| `⌘K` / `Ctrl+K` | Open global search |
| `⌘/` / `Ctrl+/` | Toggle sidebar |
| `Esc` | Close modals/search |

---

## 📱 Responsive Behavior

- **Desktop (>1280px)**: Full layout with expanded sidebar
- **Tablet (768-1280px)**: Collapsed sidebar, stacked grid
- **Mobile (<768px)**: Hidden sidebar, vertical layout
