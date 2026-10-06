export async function sendLeadNotification(leadData: {
  siteTitle: string;
  name: string;
  phone: string;
  message?: string;
}) {
  const webhookUrl = process.env.DISCORD_LEAD_WEBHOOK_URL;
  if (!webhookUrl) {
    console.log('[LEAD_NOTIFICATION_SKIP] DISCORD_LEAD_WEBHOOK_URL 미설정');
    return;
  }

  try {
    const content = {
      embeds: [
        {
          title: '🚨 신규 B2B 상담 문의 접수!',
          color: 0x2563eb, // 블루 컬러
          fields: [
            { name: '사이트 / 고객사', value: leadData.siteTitle, inline: false },
            { name: '성함 / 담당자', value: leadData.name, inline: true },
            { name: '연락처', value: leadData.phone, inline: true },
            { name: '문의 내용', value: leadData.message || '내용 없음', inline: false },
            { name: '접수 시각', value: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }), inline: false },
          ],
        },
      ],
    };

    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
    });
  } catch (err) {
    console.error('[LEAD_NOTIFICATION_ERROR]', err);
  }
}