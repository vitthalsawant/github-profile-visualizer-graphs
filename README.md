# GitHub Profile Visualizer

A beautiful, modern web application that transforms GitHub profiles into comprehensive visual analytics. Get instant insights into any GitHub user's coding activity, repository stats, and contribution patterns.

## 🚀 Features

### 📊 Comprehensive Profile Analytics
- **Profile Summary**: Display key metrics including total repositories, followers, following, and overall code quality score
- **Real-time Contribution Heatmap**: Authentic GitHub-style contribution calendar with actual user data
- **Advanced Analytics**: Visual charts showing language distribution, commit frequency, and development patterns
- **Repository Showcase**: Detailed repository list with stars, forks, topics, and recent activity

### 🎨 Modern User Experience
- **Responsive Design**: Beautiful UI that works perfectly on all devices
- **Real-time Data**: Live GitHub API integration for up-to-date information
- **Interactive Charts**: Hover effects and detailed tooltips for better data exploration
- **Gradient Themes**: Eye-catching design with smooth animations and transitions

### 🔧 Technical Features
- **GitHub API Integration**: Fetches comprehensive data including contributions, repositories, and user statistics
- **Performance Optimized**: Fast loading with efficient data caching
- **Error Handling**: Graceful handling of API limits and invalid usernames
- **Analytics Tracking**: Optional usage analytics for insights

## 🖥️ Live Demo
Visit any GitHub profile by entering a username or URL - try "octocat" to see it in action!

## 🗂️ Folder Structure
```
├── public/           # Static assets (favicon, placeholder images, robots.txt)
├── src/              # Source code
│   ├── components/   # React components (UI, analytics, charts)
│   ├── hooks/        # Custom React hooks
│   ├── integrations/ # API integrations (e.g., Supabase, GitHub)
│   ├── lib/          # Utility functions
│   ├── pages/        # App pages (Index, NotFound)
│   ├── App.tsx       # Main app component
│   └── main.tsx      # App entry point
```

## 🛠️ Technologies Used

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized builds
- **Tailwind CSS** with custom design system for beautiful UI
- **Shadcn/ui** for consistent, accessible components
- **Recharts** for interactive data visualizations
- **Lucide React** for beautiful icons

### Backend & APIs
- **Supabase** for database, authentication, and serverless functions
- **GitHub REST API** for user profiles, repositories, and statistics
- **GitHub GraphQL API** for contribution data and advanced analytics
- **Edge Functions** for secure API key management

### Additional Tools
- **React Router** for navigation
- **React Hook Form** with Zod validation
- **Sonner** for elegant toast notifications
- **Date-fns** for date manipulation

## 🏁 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- A GitHub account (for API access)
- Supabase account (for backend services)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/github-profile-visualizer.git
   cd github-profile-visualizer
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or with bun
   bun install
   ```

3. **Set up Supabase:**
   - Create a new Supabase project
   - Run the provided migrations to set up the database schema
   - Configure your GitHub Personal Access Token in Supabase secrets

4. **Configure environment:**
   - Update the Supabase configuration in `src/integrations/supabase/client.ts`
   - The project uses Supabase secrets for secure API key storage

5. **Start the development server:**
   ```bash
   npm run dev
   # or with bun
   bun run dev
   ```

6. **Open in browser:**
   Visit `http://localhost:5173` to see the application

### GitHub API Setup
The application requires a GitHub Personal Access Token for API access:
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate a new token with `public_repo` and `user` scopes
3. Add the token to your Supabase project secrets as `GITHUB_TOKEN`

## 📊 How It Works

1. **User Input**: Enter any GitHub username or profile URL
2. **Data Fetching**: The app securely fetches data using Supabase Edge Functions
3. **Processing**: Raw GitHub data is processed and analyzed for insights
4. **Visualization**: Beautiful charts and graphs display the results
5. **Analytics**: Optional usage tracking helps improve the service

## 🎯 Key Components

- `GitHubProfileForm`: Handles user input and validation
- `ProfileSummary`: Displays user stats and calculated quality score
- `ContributionHeatmap`: Shows real GitHub contribution data
- `AdvancedAnalytics`: Interactive charts for deeper insights
- `RepositoryList`: Comprehensive repository showcase

## 🔒 Privacy & Security

- No user authentication required - completely anonymous usage
- GitHub tokens stored securely in Supabase secrets
- Optional analytics tracking (can be disabled)
- No personal data stored beyond search analytics

## 🤝 Contributing
Contributions are welcome! Please open issues or pull requests for improvements, bug fixes, or new features.



## 📬 Contact
For questions or feedback, open an issue or reach out via GitHub.
