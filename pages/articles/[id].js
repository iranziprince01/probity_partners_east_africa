import Link from "next/link";
import { useRouter } from "next/router";
import articles from "../../data/articles.json";
import styles from "../../styles/articles.module.css";

export default function ArticleDetail() {
  const router = useRouter();
  const { id } = router.query;
  const article = articles.find((a) => a.id === Number(id));
  if (!article) return <div className={styles.container}>Loading...</div>;
  return (
    <div className={styles.container}>
      <Link href="/articles">
        <a className={styles.backLink}>← Back to Articles</a>
      </Link>
      <div className={styles.detailCard}>
        <img
          src={article.image}
          alt={article.title}
          className={styles.detailImage}
        />
        <h1 className={styles.title}>{article.title}</h1>
        <div className={styles.meta}>
          <span>{article.author}</span>
          <span> | {new Date(article.date).toLocaleDateString()}</span>
        </div>
        <p className={styles.excerpt}>{article.excerpt}</p>
      </div>
    </div>
  );
}
