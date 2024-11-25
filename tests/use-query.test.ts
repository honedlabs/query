import { it, expect, beforeEach, vi } from 'vitest'
import { useQuery } from '../src/use-query'
import type { UseQueryProps } from '../src/types'
import { router } from '@inertiajs/vue3'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'

// Mock the Inertia router
vi.mock('@inertiajs/vue3', () => ({
    router: {
        visit: vi.fn()
    }
}))

const mountQuery = (options: UseQueryProps) => {
    const TestComponent = defineComponent({
        setup() {
            const query = useQuery(options)
            return { query }
        },
        render() {
            return h('div')
        }
    })
    const wrapper = mount(TestComponent)
    return wrapper.vm.query
}

beforeEach(() => {
    window.history.pushState({}, '', '/')
    
    vi.clearAllMocks()
})

it('initializes with empty params for specified keys', () => {
    const query = mountQuery({
        keys: ['search', 'page']
    })
    
    expect(query.params.value).toEqual({
        search: null,
        page: null
    })
})

it('can set and get query parameters', () => {
    const query = mountQuery({
        keys: ['search']
    })
    
    query.set('search', 'test')
    expect(query.get('search')).toBe('test')
})

it('can clear query parameters', () => {
    const query = mountQuery({
        keys: ['search']
    })
    
    query.set('search', 'test')
    query.clear('search')
    expect(query.get('search')).toBeNull()
})

it('can reset all parameters', () => {
    const query = mountQuery({
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
    const query = mountQuery({
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
    
    const query = mountQuery({
        keys: ['search', 'page']
    })
    
    expect(query.params.value).toEqual({
        search: 'test',
        page: 1
    })
})

it('handles array parameters in URL', () => {
    window.history.pushState({}, '', '/?ids=1,2,3')
    
    const query = mountQuery({
        keys: ['ids'],
        delimiter: ','
    })
    
    expect(query.params.value).toEqual({
        ids: [1, 2, 3]
    })
})
