# PollHub - Ranked Choice Voting Platform

A web platform where a user (host) can create a ranked-choice voting contest with multiple contestants in one or more categories (each contestant has a name, avatar/photo, description, etc.). The host gets a shareable link and participants can vote by ranking contestants from most to least preferred.

Ranked-choice ensures fairer results—no more simple popularity votes or ties.

---

## 🎯 Overview

PollHub democratizes voting by providing a fair, transparent, and engaging ranked-choice voting platform. Whether it's a talent show, community awards, or team decision-making, PollHub ensures every vote counts and the most preferred option wins.

---

## 🔥 Core Features (MVP)

### 🏁 Contest Creation

Create a contest with:

- **Contest name & description** - Clear title and context for participants
- **One or multiple categories** - Organize contestants into logical groups
- **Contestants per category** - Each contestant includes:
  - Name
  - Avatar/photo
  - Bio/description
  - Optional social links (Instagram, Twitter, etc.)
- **Ranking limits** - Option to limit number of ranked picks (e.g., rank top 3 of 10 contestants)

**Settings & Configuration:**

- **Privacy controls:**
  - Public poll (anyone with link can vote)
  - Private poll with passcode protection
  - Email domain restriction (e.g., only @company.com emails)
- **Voting restrictions:**
  - One vote per device/IP
  - One vote per email address
  - One vote per authenticated account
- **Timing:**
  - Set voting deadline/end date
  - Optional start date for scheduled releases
- **Results visibility:**
  - Show live results as votes come in
  - Hide results until poll ends
  - Show results only to contest creator

### 📩 Sharing & Participation

- **Unique shareable links** - Auto-generated URLs like: `pollhub.com/vote/contest-id`
- **Social sharing** - One-click share to:
  - X (Twitter)
  - Facebook
  - Instagram bio link
  - LinkedIn
  - Copy link to clipboard
- **QR codes** - Generate QR codes for offline events, print materials, or presentations
- **Embed options** - Embed voting widget on external websites

### 🗳 Voting Experience

- **Drag-and-drop ranking UI** - Intuitive interface for ranking contestants (critical for UX)
- **Bias reduction:**
  - Option to randomize contestant display order
  - Shuffle option for each voter
- **Write-in candidates** - Optional feature to allow voters to add custom contestants
- **Vote preview** - Review ranking before submission
- **Edit votes** - Allow voters to change their ranking before deadline (if enabled)
- **Mobile-optimized** - Responsive design for voting on any device

### 📊 Results & Analytics

Uses **Instant Runoff Voting (IRV)** or **Single Transferable Vote (STV)** depending on category rules and number of winners.

**Visualization:**

- **Round-by-round elimination chart** - See how candidates are eliminated in each round
- **Sankey flow diagram** - Visualize how votes transfer between candidates
- **Final winner highlight** - Clear presentation of the winner(s)
- **Vote distribution charts** - Pie charts, bar graphs showing vote breakdown
- **Timeline view** - See how voting patterns changed over time

**Export & Sharing:**

- **CSV export** - Raw voting data for analysis
- **PDF summary** - Professional report with results and visualizations
- **Image share** - Generate shareable images of results for social media
- **Public results page** - Shareable link to view results

---

## 🤘 Example Use Cases

| Use Case | Description | Key Benefits |
|----------|-------------|--------------|
| 🎤 **Talent Show** | Schools, streamers, or event hosts let fans rank performers | Fair winner selection, engaged audience |
| 🏆 **Community Awards** | "Best local café", "Best DJ", "Artist of the year" | Community-driven recognition, avoids popularity bias |
| 🖼 **Art/Design Contests** | Rank submissions in creative competitions | Merit-based results, not just most popular |
| ❤️ **Dating Shows / Fantasy Leagues** | Rank contestants for fun prediction games | Interactive entertainment, fair rankings |
| 👥 **Team or Product Prioritization** | Internal company voting on features, hires, or ideas | Democratic decision-making, consensus building |
| 🎓 **Student Elections** | School or university student body elections | Transparent, fair voting process |
| 🎬 **Content Creator Polls** | YouTubers, streamers poll their audience | Audience engagement, community building |

---

## 🛠 Tech Stack

### Frontend

- **Framework:** Next.js 14+ (App Router) with React
- **Styling:** Tailwind CSS + shadcn/ui components
- **Drag & Drop:** `@dnd-kit` (modern, accessible, performant)
- **State Management:** React Context / Zustand (for complex state)
- **Forms:** React Hook Form + Zod validation
- **Animations:** Framer Motion (for smooth UI transitions)

### Backend

- **API:** Next.js API Routes (serverless functions)
- **Database:** PostgreSQL with Neon DB (serverless Postgres)
- **ORM:** Drizzle ORM (type-safe, lightweight)
- **Caching:** Redis (optional) for rate limiting and caching
- **Real-time:** WebSockets or Server-Sent Events (for live results)
- **Webhooks:** Event-driven updates for integrations

### Authentication & Security

- **Auth:** Better-Auth (modern, type-safe authentication)
- **Rate Limiting:** Upstash Redis or Vercel Edge Config
- **Security:**
  - CSRF protection
  - Input validation and sanitization
  - SQL injection prevention (via ORM)
  - XSS protection

### Deployment

- **Frontend:** Vercel (optimized for Next.js)
- **Database:** Neon DB (serverless Postgres)
- **Backend:** Vercel Serverless Functions (Next.js API routes)
- **CDN:** Vercel Edge Network
- **Monitoring:** Vercel Analytics + Sentry (error tracking)

### Development Tools

- **Type Safety:** TypeScript
- **Linting:** ESLint + Prettier
- **Testing:** Vitest + React Testing Library
- **E2E Testing:** Playwright (optional)

---

## 💰 Monetization Strategy

| Tier | Price | Features | Target Audience |
|------|-------|----------|-----------------|
| **Free** | $0 | • Up to 5 contestants per category<br>• 1 category per contest<br>• Basic results visualization<br>• Watermarked results | Individual creators, small events |
| **Pro** | $9-19/mo | • Unlimited contestants & categories<br>• Custom branding<br>• CSV/PDF export<br>• Advanced analytics<br>• No ads<br>• Priority support | Content creators, small businesses |
| **Event/Enterprise** | Custom | • Bulk contest creation<br>• API access<br>• Advanced analytics dashboards<br>• Custom domain<br>• White-label voting page<br>• Dedicated support | Large organizations, agencies |
| **Add-ons** | One-time | • Custom domain ($5/mo)<br>• Extended voting period<br>• Additional exports | All tiers |

---

## 🎨 UI/UX Design Principles

### Interface Design

- **Clean ballot-style interface** - Familiar, trustworthy voting experience
- **Drag ranking list** - Visual, intuitive ranking:
  ```
  1️⃣ Contestant A
  2️⃣ Contestant C
  3️⃣ Contestant B
  ```
- **Accessibility:**
  - Screen reader support (ARIA labels)
  - Keyboard navigation
  - High contrast mode
  - WCAG 2.1 AA compliance
- **Progress indicators:**
  - Voting progress (X of Y contestants ranked)
  - Time remaining until deadline
  - Vote submission confirmation

### User Experience

- **Onboarding:** Simple, guided contest creation flow
- **Mobile-first:** Optimized for mobile voting experience
- **Fast loading:** Minimal JavaScript, optimized images
- **Offline support:** Service worker for offline voting (optional)

---

## 🧮 Ranked Choice Algorithm

### Instant Runoff Voting (IRV) - Single Winner

1. **Count first-choice votes** - Tally all voters' top preferences
2. **Check for majority** - If a candidate has >50% of first-choice votes, they win
3. **Eliminate lowest** - Remove the candidate with the fewest first-choice votes
4. **Redistribute votes** - Transfer eliminated candidate's votes to each voter's next-ranked choice
5. **Repeat** - Continue elimination rounds until a candidate reaches majority

### Single Transferable Vote (STV) - Multiple Winners

Similar to IRV but allows multiple winners. Votes are transferred proportionally based on a quota system.

### Edge Cases Handled

- Ties in elimination rounds
- Exhausted ballots (no remaining preferences)
- All candidates eliminated (rare)
- Single candidate contests

---

## 🔒 Security & Privacy

- **Vote integrity:**
  - One vote per person (enforced by device/email/account)
  - Vote encryption at rest
  - Tamper-proof vote storage
- **Privacy:**
  - GDPR compliance
  - Data retention policies
  - User data deletion on request
  - Anonymous voting option
- **Anti-fraud:**
  - Rate limiting
  - IP-based restrictions
  - CAPTCHA for suspicious activity (optional)
  - Email verification for private polls

---

## 📦 Future Expansion Ideas

### Phase 2 Features

- 🔹 **AI ranking suggestions** - Based on user values and preferences
- 🔹 **Live voting** - Real-time scoreboard for events
- 🔹 **Multi-language support** - Internationalization (i18n)
- 🔹 **Advanced analytics** - Demographic breakdowns, voting patterns
- 🔹 **Integration APIs** - Connect with other platforms (Discord, Slack, etc.)

### Phase 3 Features

- 🔹 **Creator Revenue Sharing** - Fans can tip contestants
- 🔹 **White-label solution** - Fully customizable for schools, esports, YouTubers
- 🔹 **Blockchain verification** - Optional NFT/blockchain verification for anti-fraud
- 🔹 **Team collaboration** - Multiple hosts can manage a contest
- 🔹 **Voting campaigns** - Scheduled voting periods with reminders

---

## 📝 Example Scenario

**Scenario:** A YouTuber wants fans to rank **Best Singer of 2025**.

1. **Setup:** Creator adds 6 singers with photos, bios, and links to their performances
2. **Configuration:** Sets voting deadline to 7 days, enables live results, allows top 3 ranking
3. **Sharing:** Shares unique link in video description + community post, generates QR code for Instagram story
4. **Voting:** Fans visit link, drag and rank their top 3 singers
5. **Results:** After 7-day countdown, results are revealed with round-by-round visualization
6. **Outcome:** Winner gets a collab with the YouTuber 🎉

**Metrics:**
- 10,000+ votes collected
- 85% completion rate (voters who finished ranking)
- Average time to vote: 2.5 minutes
- Results shared 5,000+ times on social media

---

## 🚀 Development Roadmap

### Phase 1: MVP (Weeks 1-8)
- [ ] Core contest creation
- [ ] Basic voting interface with drag-and-drop
- [ ] IRV algorithm implementation
- [ ] Results visualization
- [ ] Authentication with Better-Auth
- [ ] Basic sharing features

### Phase 2: Polish (Weeks 9-12)
- [ ] Advanced settings (privacy, restrictions)
- [ ] Export functionality (CSV, PDF)
- [ ] Mobile optimization
- [ ] Analytics dashboard
- [ ] QR code generation

### Phase 3: Growth (Weeks 13-16)
- [ ] Monetization features
- [ ] Advanced visualizations
- [ ] API development
- [ ] White-label options
- [ ] Performance optimization

---

## 📚 Additional Resources

If you want, I can also help you with:

- 🔧 **Database schema** - Complete ERD and table structures
- 🧮 **Ranked choice algorithm code** - TypeScript/Next.js implementation
- 🎨 **UI mockups** - Figma-style designs and wireframes
- 📑 **Pitch deck** - Investor presentation template
- 🧱 **Feature backlog** - Detailed user stories and acceptance criteria
- 📌 **Domain & branding** - Name suggestions and brand identity
- 🔐 **Security audit** - Security best practices checklist
- 📊 **Analytics plan** - Metrics and tracking strategy
