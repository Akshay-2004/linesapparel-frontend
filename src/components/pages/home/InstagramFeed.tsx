import Link from 'next/link'
import React from 'react'

type Post = {
	id: string
	caption?: string
	mediaType: string
	mediaUrl: string
	thumbnailUrl?: string | null
	permalink?: string
}

export default function InstagramFeed() {
	const [posts, setPosts] = React.useState<Post[] | null>(null)
	const [loading, setLoading] = React.useState(true)
	const [error, setError] = React.useState<string | null>(null)

	React.useEffect(() => {
		let cancelled = false

		async function load() {
			setLoading(true)
			setError(null)
			try {
				const res = await fetch('/api/instagram')
				if (!res.ok) {
					const json = await res.json().catch(() => ({}))
					throw new Error(json?.error || `Status ${res.status}`)
				}
				const data = await res.json()
				if (!cancelled) {
					setPosts(Array.isArray(data.posts) ? data.posts : [])
				}
			} catch (err: any) {
				if (!cancelled) setError(err.message || 'Failed to load Instagram feed')
			} finally {
				if (!cancelled) setLoading(false)
			}
		}

		load()
		return () => {
			cancelled = true
		}
	}, [])

	if (loading) {
		return (
			<div className="w-full py-8">
				<h2 className="text-center text-2xl font-semibold mb-6">FOLLOW US ON INSTAGRAM</h2>
				<div className="grid grid-cols-4 gap-4">
					{Array.from({ length: 8 }).map((_, i) => (
						<div key={i} className="bg-gray-100 animate-pulse aspect-square" />
					))}
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="w-full py-8">
				<h2 className="text-center text-2xl font-semibold mb-6">FOLLOW US ON INSTAGRAM</h2>
				<div className="text-center text-muted-foreground">{error}</div>
			</div>
		)
	}

	return (
		<div className="w-full py-8">
			<div className="container mx-auto px-4">
				<h2 className="text-center text-2xl font-semibold mb-6">FOLLOW US ON INSTAGRAM</h2>
				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-0">
				{posts && posts.length > 0 ? (
					posts.map((p) => {
						const src = p.mediaUrl || (p.thumbnailUrl ?? '')
						return (
							<Link
								key={p.id}
								href={p.permalink || '#'}
								target="_blank"
								rel="noopener noreferrer"
								className="block overflow-hidden  bg-gray-50"
								aria-label={p.caption || 'Instagram post'}
							>
								<div className="relative w-full h-0 pb-[100%]">
									<img
										src={src}
										alt={p.caption ?? 'Instagram image'}
										className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-300"
										loading="lazy"
									/>
								</div>
							</Link>
						)
					})
				) : (
					<div className="col-span-full text-center text-muted-foreground">No posts to show</div>
				)}
				</div>
			</div>
		</div>
	)
}
