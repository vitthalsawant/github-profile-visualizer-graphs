import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    const { username, endpoint = 'user' } = body
    
    if (!username) {
      throw new Error('Username is required')
    }

    const githubToken = Deno.env.get('GITHUB_TOKEN')
    if (!githubToken) {
      throw new Error('GitHub token not configured')
    }

    let apiUrl = ''
    switch (endpoint) {
      case 'user':
        apiUrl = `https://api.github.com/users/${username}`
        break
      case 'repos':
        apiUrl = `https://api.github.com/users/${username}/repos?sort=stars&direction=desc&per_page=100`
        break
      case 'events':
        apiUrl = `https://api.github.com/users/${username}/events/public?per_page=100`
        break
      case 'commits':
        const { repo } = body
        if (!repo) throw new Error('Repository name required for commits endpoint')
        apiUrl = `https://api.github.com/repos/${username}/${repo}/commits?per_page=100`
        break
      case 'issues':
        apiUrl = `https://api.github.com/search/issues?q=author:${username}+type:issue&per_page=100`
        break
      case 'pulls':
        apiUrl = `https://api.github.com/search/issues?q=author:${username}+type:pr&per_page=100`
        break
      case 'languages':
        const { repoName } = body
        if (!repoName) throw new Error('Repository name required for languages endpoint')
        apiUrl = `https://api.github.com/repos/${username}/${repoName}/languages`
        break
      default:
        throw new Error('Invalid endpoint')
    }

    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `token ${githubToken}`,
        'User-Agent': 'GitHub-Profile-Generator',
        'Accept': 'application/vnd.github.v3+json'
      }
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('User not found')
      }
      if (response.status === 403) {
        throw new Error('Rate limit exceeded or access denied')
      }
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const data = await response.json()

    return new Response(
      JSON.stringify({ data, success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})