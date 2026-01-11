<script lang="ts">
	export type PostListItem = {
		slug: string;
		data: {
			title: string;
			pubDate: Date;
			description?: string;
		};
	};

	type Props = {
		posts: PostListItem[];
	};

	let { posts }: Props = $props();
</script>

{#if posts.length === 0}
	<p>暂时还没有文章。</p>
{:else}
	<ul>
		{#each posts as post (post.slug)}
			<li>
				<a href={`/posts/${post.slug}/`}>{post.data.title}</a>
				<span> — </span>
				<time datetime={post.data.pubDate.toISOString()}>
					{post.data.pubDate.toLocaleDateString('zh-CN')}
				</time>
				{#if post.data.description}
					<div>{post.data.description}</div>
				{/if}
			</li>
		{/each}
	</ul>
{/if}
