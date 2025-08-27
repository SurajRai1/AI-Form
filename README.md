# FormCraft AI - AI-Powered Form Builder

A modern, production-ready form builder powered by AI with beautiful UI/UX and comprehensive authentication.

## 🚀 Features

- **AI-Powered Form Generation** - Create forms using natural language
- **Beautiful UI/UX** - Modern design with dark/light mode support
- **Authentication System** - Complete auth with Supabase
- **Google OAuth** - One-click sign-in with Google
- **Password Reset** - Secure password reset functionality
- **Responsive Design** - Works perfectly on all devices
- **Production Ready** - Environment variables, error handling, and security

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel (recommended)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd formcraft-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Application Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_APP_NAME=FormCraft AI

   # Authentication Configuration
   NEXT_PUBLIC_AUTH_REDIRECT_URL=http://localhost:3000/auth/callback
   ```

4. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Get your project URL and anon key from the project settings
   - Enable Google OAuth in Authentication > Providers
   - Add your redirect URLs in Authentication > URL Configuration

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key | Yes |
| `NEXT_PUBLIC_APP_URL` | Your application URL | Yes |
| `NEXT_PUBLIC_APP_NAME` | Application name | No (defaults to "FormCraft AI") |
| `NEXT_PUBLIC_AUTH_REDIRECT_URL` | OAuth redirect URL | Yes |

## 🔐 Authentication Setup

### Supabase Configuration

1. **Enable Email Auth**
   - Go to Authentication > Providers
   - Enable Email provider
   - Configure email templates if needed

2. **Enable Google OAuth**
   - Go to Authentication > Providers
   - Enable Google provider
   - Add your Google OAuth credentials
   - Set redirect URL to: `https://your-domain.com/auth/callback`

3. **Configure URL Settings**
   - Go to Authentication > URL Configuration
   - Add your site URL
   - Add redirect URLs for auth flows

### Google OAuth Setup

1. **Create Google OAuth App**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs

2. **Add to Supabase**
   - Copy Client ID and Client Secret
   - Add to Supabase Google provider settings

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Connect your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy

3. **Update Supabase Settings**
   - Update redirect URLs with your production domain
   - Update site URL in Supabase dashboard

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication routes
│   ├── dashboard/         # Protected dashboard
│   ├── signin/           # Sign in page
│   ├── signup/           # Sign up page
│   ├── forgot-password/  # Password reset
│   └── layout.tsx        # Root layout
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   └── theme-toggle.tsx  # Theme switcher
├── contexts/             # React contexts
│   └── AuthContext.tsx   # Authentication context
├── lib/                  # Utility libraries
│   ├── supabase.ts       # Supabase client
│   ├── env.ts           # Environment validation
│   └── utils.ts         # Utility functions
├── middleware.ts         # Next.js middleware
└── tailwind.config.ts   # Tailwind configuration
```

## 🔒 Security Features

- **Environment Variables** - All sensitive data stored in env files
- **Input Validation** - Client and server-side validation
- **Error Handling** - Comprehensive error handling and logging
- **Session Management** - Secure session handling with Supabase
- **Password Requirements** - Minimum 6 characters, confirmation required
- **CSRF Protection** - Built-in protection through Supabase
- **Rate Limiting** - Supabase provides rate limiting

## 🎨 Customization

### Styling
- Modify `tailwind.config.ts` for theme customization
- Update color schemes in `app/globals.css`
- Customize components in `components/ui/`

### Authentication
- Add more OAuth providers in Supabase
- Customize email templates
- Modify auth flow in `contexts/AuthContext.tsx`

### Features
- Add more form types
- Implement form analytics
- Add team collaboration features

## 🐛 Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**
   - Ensure `.env.local` is in the root directory
   - Restart the development server
   - Check variable names match exactly

2. **Google OAuth Not Working**
   - Verify redirect URLs in Google Console
   - Check Supabase Google provider settings
   - Ensure HTTPS in production

3. **Authentication Errors**
   - Check Supabase project settings
   - Verify email templates are configured
   - Check browser console for errors

### Getting Help

- Check the [Supabase documentation](https://supabase.com/docs)
- Review [Next.js documentation](https://nextjs.org/docs)
- Open an issue in the repository

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support, email support@formcraft-ai.com or open an issue in the repository.
