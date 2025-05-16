import Link from "next/link";
import { useRouter } from "next/router";
import news from "../../data/news.json";
import styles from "../../styles/news.module.css";

export default function NewsDetail() {
  const router = useRouter();
  const { id } = router.query;
  const item = news.find((n) => n.id === Number(id));
  if (!item) return <div className={styles.container}>Loading...</div>;
  return (
    <div className={styles.container}>
      <Link href="/news">
        <a className={styles.backLink}>← Back to News</a>
      </Link>
      <div className={styles.detailCard}>
        <img src={item.image} alt={item.title} className={styles.detailImage} />
        <h1 className={styles.title}>{item.title}</h1>
        <div className={styles.meta}>
          <span>{item.author}</span>
          <span> | {new Date(item.date).toLocaleDateString()}</span>
        </div>
        <p className={styles.excerpt}>{item.excerpt}</p>
      </div>
    </div>
  );
}
