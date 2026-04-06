import React, { useMemo } from 'react';
import Markdown from 'react-native-markdown-display';
import { processWikilinks } from './wikilinks';
import { useTheme } from '@/components/theme-provider';
import { Pressable, Text, Linking } from 'react-native';

interface MarkdownViewProps {
  content: string;
  onWikilinkPress?: (title: string) => void;
}

export function MarkdownView({ content, onWikilinkPress }: MarkdownViewProps) {
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';

  const processedContent = useMemo(() => {
    return processWikilinks(content, (title) => {
      return `[${title}](wiki://${encodeURIComponent(title)})`;
    });
  }, [content]);

  const markdownStyles = useMemo(
    () => ({
      body: {
        color: isDark ? '#fafafa' : '#09090b',
        fontSize: 16,
        lineHeight: 24,
      },
      heading1: {
        color: isDark ? '#fafafa' : '#09090b',
        fontSize: 28,
        fontWeight: '700' as const,
        marginTop: 24,
        marginBottom: 12,
      },
      heading2: {
        color: isDark ? '#fafafa' : '#09090b',
        fontSize: 24,
        fontWeight: '600' as const,
        marginTop: 20,
        marginBottom: 10,
      },
      heading3: {
        color: isDark ? '#fafafa' : '#09090b',
        fontSize: 20,
        fontWeight: '600' as const,
        marginTop: 16,
        marginBottom: 8,
      },
      paragraph: {
        marginTop: 0,
        marginBottom: 12,
      },
      link: {
        color: isDark ? '#38bdf8' : '#0ea5e9',
      },
      blockquote: {
        backgroundColor: isDark ? '#18181b' : '#f4f4f5',
        borderLeftWidth: 4,
        borderLeftColor: '#3b82f6',
        paddingLeft: 12,
        paddingVertical: 8,
        marginVertical: 8,
      },
      code_inline: {
        backgroundColor: isDark ? '#27272a' : '#f4f4f5',
        color: isDark ? '#f472b6' : '#db2777',
        fontFamily: 'monospace',
        fontSize: 14,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
      },
      code_block: {
        backgroundColor: isDark ? '#18181b' : '#f4f4f5',
        color: isDark ? '#e4e4e7' : '#18181b',
        fontFamily: 'monospace',
        fontSize: 14,
        padding: 12,
        borderRadius: 8,
        marginVertical: 8,
      },
      fence: {
        backgroundColor: isDark ? '#18181b' : '#f4f4f5',
        color: isDark ? '#e4e4e7' : '#18181b',
        fontFamily: 'monospace',
        fontSize: 14,
        padding: 12,
        borderRadius: 8,
        marginVertical: 8,
      },
      list_item: {
        marginBottom: 4,
      },
      bullet_list: {
        marginBottom: 12,
      },
      ordered_list: {
        marginBottom: 12,
      },
      strong: {
        fontWeight: '700' as const,
      },
      em: {
        fontStyle: 'italic' as const,
      },
      hr: {
        backgroundColor: isDark ? '#3f3f46' : '#e4e4e7',
        height: 1,
        marginVertical: 16,
      },
    }),
    [isDark]
  );

  const handleLinkPress = (url: string): boolean => {
    if (url.startsWith('wiki://')) {
      const title = decodeURIComponent(url.replace('wiki://', ''));
      onWikilinkPress?.(title);
      return false;
    } else {
      Linking.openURL(url);
      return false;
    }
  };

  return (
    <Markdown
      style={markdownStyles}
      onLinkPress={handleLinkPress}
    >
      {processedContent}
    </Markdown>
  );
}
