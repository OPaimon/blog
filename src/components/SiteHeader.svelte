<script lang="ts">
	type Props = {
		currentPath: string;
	};

	let { currentPath }: Props = $props();

	const links = [
		{ href: '/', label: '首页' },
		{ href: '/posts/', label: '文章' },
		{ href: '/about/', label: '关于' },
	];

	function isActiveLink(href: string) {
		if (href === '/') return currentPath === '/';
		return currentPath.startsWith(href);
	}
</script>

<header>
	<div>
		<a href="/">个人博客</a>
	</div>
	<nav aria-label="站点导航">
		{#each links as link (link.href)}
			<a href={link.href} aria-current={isActiveLink(link.href) ? 'page' : undefined}>
				{link.label}
			</a>
		{/each}
	</nav>
</header>
