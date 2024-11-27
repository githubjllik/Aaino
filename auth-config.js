const SUPABASE_URL = 'https://wdyvvgxritetqhouwebf.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkeXZ2Z3hyaXRldHFob3V3ZWJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI2MjczMzYsImV4cCI6MjA0ODIwMzMzNn0.3IFR6RtNKHYm-Ezrb4OzgS2wLcgDvE5VD30F91H6jDU'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Configuration OAuth
const googleOAuth = {
  provider: 'google',
  options: {
    scope: 'email profile'
  }
}

const githubOAuth = {
  provider: 'github',
  options: {
    scope: 'user'
  }
}
