import styles from '@/styles/Tags.module.scss';
import { redirect } from 'next/navigation';

/**
 * @param {string} redirectUrlWithPlaceholder Use `${tag}` as a placeholder in the redirect URL. e.g. `/gallery/${tag}/1`
 */
export default function Tags({
  activeTag,
  tags,
  redirectUrlWithPlaceholder = '/gallery/${tag}/1',
}: {
  activeTag: string;
  tags: string[];
  redirectUrlWithPlaceholder?: string;
}) {
  return (
    <div className={styles.tags}>
      <span
        key="all"
        className={`${styles.tag} ${activeTag === 'all' ? styles.tagActive : ''}`}
        onClick={() => redirect(redirectUrlWithPlaceholder.replace('${tag}', 'all'))}>
        All
      </span>
      {tags.map((tag, index) => {
        return (
          <span
            key={index}
            className={`${styles.tag} ${activeTag === tag ? styles.tagActive : ''}`}
            onClick={() => redirect(redirectUrlWithPlaceholder.replace('${tag}', tag))}>
            {tag}
          </span>
        );
      })}
    </div>
  );
}
