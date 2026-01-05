import { describe, it, expect } from 'vitest'
import { parseGitHubUrl } from '@/lib/github'

describe('parseGitHubUrl', () => {
    it('parses standard GitHub URLs correctly', () => {
        const result = parseGitHubUrl('https://github.com/facebook/react')
        expect(result).toEqual({ owner: 'facebook', repo: 'react' })
    })

    it('parses GitHub URLs with .git suffix', () => {
        const result = parseGitHubUrl('https://github.com/facebook/react.git')
        expect(result).toEqual({ owner: 'facebook', repo: 'react' })
    })

    it('parses owner/repo format', () => {
        const result = parseGitHubUrl('facebook/react')
        expect(result).toEqual({ owner: 'facebook', repo: 'react' })
    })

    it('parses URLs with query parameters', () => {
        const result = parseGitHubUrl('https://github.com/facebook/react?tab=readme')
        expect(result).toEqual({ owner: 'facebook', repo: 'react' })
    })

    it('returns null for invalid URLs', () => {
        const result = parseGitHubUrl('not-a-valid-url')
        expect(result).toBeNull()
    })
})
