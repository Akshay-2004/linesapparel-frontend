import Link from 'next/link'
import React from 'react'
import ProductTitleSection from "@/components/shared/ProductTitleSection";
import { ProductSkeleton } from '@/components/skeletons/ProductSkeleton';

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
					setPosts(Array.isArray(data.posts) ? data.posts.slice(0, 6) : [])
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
			<section className="bg-white py-12 md:py-16">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<ProductTitleSection
						description="Follow us for the latest fashion trends and behind-the-scenes content"
						title="FOLLOW US ON INSTAGRAM"
						topText="Stay Connected"
						buttonText="Follow Us"
						buttonLink="https://instagram.com"
					/>
					<div className="mt-6">
						<div className="hidden md:grid md:grid-cols-6 gap-4">
							{Array.from({ length: 6 }).map((_, i) => (
								<div key={i} className="bg-gray-100 animate-pulse rounded-lg aspect-[4/5]" />
							))}
						</div>
						<div className="md:hidden">
							<div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
								{Array.from({ length: 6 }).map((_, i) => (
									<div key={i} className="bg-gray-100 animate-pulse rounded-lg w-[120px] h-[150px] flex-shrink-0" />
								))}
							</div>
						</div>
					</div>
				</div>
			</section>
		)
	}

	if (error) {
		return (
			<section className="bg-white py-12 md:py-16">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<ProductTitleSection
						description="Follow us for the latest fashion trends and behind-the-scenes content"
						title="FOLLOW US ON INSTAGRAM"
						topText="Stay Connected"
						buttonText="Follow Us"
						buttonLink="https://instagram.com"
					/>
					<div className="mt-6 text-center text-muted-foreground">
						{error}
					</div>
				</div>
			</section>
		)
	}

	return (
		<section className="bg-white py-12 md:py-16">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<ProductTitleSection
					description="Follow us for the latest fashion trends and behind-the-scenes content"
					title="FOLLOW US ON INSTAGRAM"
					topText="Stay Connected"
					buttonText="Follow Us"
					buttonLink="https://instagram.com"
				/>

				<div className="mt-6">
					{/* Desktop Grid View */}
					<div className="hidden md:grid md:grid-cols-6 gap-4">
						{posts && posts.length > 0 ? (
							posts.map((p) => {
								const src = p.mediaUrl || (p.thumbnailUrl ?? '')
								return (
									<Link
										key={p.id}
										href={p.permalink || '#'}
										target="_blank"
										rel="noopener noreferrer"
										className="block overflow-hidden bg-gray-50 rounded-lg hover:shadow-lg transition-shadow duration-300 aspect-[4/5]"
										aria-label={p.caption || 'Instagram post'}
									>
										<img
											src={src}
											alt={p.caption ?? 'Instagram image'}
											className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 rounded-lg"
											loading="lazy"
										/>
									</Link>
								)
							})
						) : (
							<div className="col-span-full text-center text-muted-foreground py-8">
								No posts to show
							</div>
						)}
					</div>

					{/* Mobile Horizontal Scroll View */}
					<div className="md:hidden">
						{posts && posts.length > 0 ? (
							<div className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory pb-2">
								{posts.map((p) => {
									const src = p.mediaUrl || (p.thumbnailUrl ?? '')
									return (
										<Link
											key={p.id}
											href={p.permalink || '#'}
											target="_blank"
											rel="noopener noreferrer"
											className="block overflow-hidden bg-gray-50 rounded-lg hover:shadow-lg transition-shadow duration-300 w-[120px] h-[150px] flex-shrink-0 snap-center"
											aria-label={p.caption || 'Instagram post'}
										>
											<img
												src={src}
												alt={p.caption ?? 'Instagram image'}
												className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 rounded-lg"
												loading="lazy"
											/>
										</Link>
									)
								})}
							</div>
						) : (
							<div className="text-center text-muted-foreground py-8">
								No posts to show
							</div>
						)}
					</div>
				</div>
			</div>
		</section>
	)
}
