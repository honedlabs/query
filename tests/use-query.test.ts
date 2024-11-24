import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { useQuery } from '../src/use-query'
import { router } from '@inertiajs/vue3'

// Mock the Inertia router
vi.mock('@inertiajs/vue3', () => ({
  router: {
    visit: vi.fn()
  }
}))

describe('useQuery', () => {
  beforeEach(() => {
    // Reset URL before each test
    window.history.pushState({}, '', '/')
    
    // Clear all mocks
    vi.clearAllMocks()
  })

  afterEach(() => {
    // Reset URL after each test
    window.history.pushState({}, '', '/')
  })

  it('initializes with empty params for specified keys', () => {
    const query = useQuery({
      keys: ['search', 'page']
    })

    expect(query.params.value).toEqual({
      search: null,
      page: null
    })
  })

  it('can set and get query parameters', () => {
    const query = useQuery({
      keys: ['search']
    })

    query.set('search', 'test')
    expect(query.get('search')).toBe('test')
  })

  it('can clear query parameters', () => {
    const query = useQuery({
      keys: ['search']
    })

    query.set('search', 'test')
    query.clear('search')
    expect(query.get('search')).toBeNull()
  })

  it('can reset all parameters', () => {
    const query = useQuery({
      keys: ['search', 'page']
    })

    query.set('search', 'test')
    query.set('page', 1)
    query.reset()

    expect(query.params.value).toEqual({
      search: null,
      page: null
    })
  })

  it('converts array values to delimited strings', () => {
    const query = useQuery({
      keys: ['ids'],
      delimiter: ','
    })

    query.set('ids', [1, 2, 3])
    query.reload()

    expect(router.visit).toHaveBeenCalledWith('/', {
      data: { ids: '1,2,3' },
      preserveScroll: false,
      preserveState: false,
      only: [],
      except: []
    })
  })

  it('reads query parameters from URL', () => {
    // Set up URL with query parameters
    window.history.pushState({}, '', '/?search=test&page=1')

    const query = useQuery({
      keys: ['search', 'page']
    })

    // Manually trigger mounted hook since we're not in a component
    vi.runAllHooks()

    expect(query.params.value).toEqual({
      search: 'test',
      page: 1
    })
  })

  it('handles array parameters in URL', () => {
    window.history.pushState({}, '', '/?ids=1,2,3')

    const query = useQuery({
      keys: ['ids'],
      delimiter: ','
    })

    // Manually trigger mounted hook
    vi.runAllHooks()

    expect(query.params.value).toEqual({
      ids: [1, 2, 3]
    })
  })
}) 