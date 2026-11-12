import Link from 'next/link';

/** One source for NEXIA terms, refund guidance and checkout. Not MedinSure policy. */
export default function NexiaRefundPolicy({ compact = false }: { compact?: boolean }) {
  if (compact) return <div className="space-y-2 text-xs leading-6">
    <p>이번 카드 결제는 NEXIA 월 관리비만 청구합니다. 제작비는 포함되지 않으며, 제작 범위·금액·지급 일정은 별도 계약으로 확인합니다.</p>
    <p>자동갱신 중단 시 결제한 기간 종료일까지 이용할 수 있습니다. 즉시 해지·환불은 미사용 기간을 일할 정산합니다. 제작비는 실제 작업 진행 상태와 미이행 범위를 기준으로 정산하며 법정 청약철회 권리를 보장합니다.</p>
    <Link href="/refund" className="font-bold underline">NEXIA 해지·환불 기준 및 신청 방법</Link>
  </div>;
  return <div className="space-y-5 leading-7">
    <p>이 안내는 NEXIA 홈페이지 제작 및 월 관리 서비스에 적용합니다. MedinSure의 유료 구독 정책은 별도로 안내하며 현재 결제 준비 중입니다.</p>
    <section><h3 className="font-bold">제작비</h3><p>작업 착수 전에는 전액 환불합니다. 법정 청약철회에 해당하지 않는 착수 후 중도해지는 사전에 합의한 작업 범위와 실제 완료 내역에 따라 정산하고 미이행 부분을 환불합니다. 산정 내역과 근거를 안내하며 일률적으로 50%를 공제하지 않습니다. 완성본 발송만으로 하자·계약 불이행에 대한 권리가 제한되지 않습니다.</p></section>
    <section><h3 className="font-bold">자동갱신 중단</h3><p>다음 회차 자동결제를 중단하고 이미 결제한 기간 종료일까지 이용합니다. 달력상 월말이 아니라 고객의 결제 이용 기간이 기준입니다. 자동갱신 중단과 즉시 해지·환불은 별도로 신청할 수 있습니다.</p></section>
    <section><h3 className="font-bold">즉시 해지·월 관리비 환불</h3><p>실제 결제한 월 관리비 × 미사용 일수 ÷ 해당 결제 이용 기간의 전체 일수로 정산합니다. 한국시간 기준 신청일을 미사용 일수에 포함하고, 다음 결제 예정일은 해당 기간에서 제외합니다. 원 미만은 고객에게 유리하게 올림하며 실제 결제액을 초과하지 않습니다. 별도 해지 위약금이나 할인 회수는 적용하지 않습니다. 법정 전액 환불 사유가 있으면 이 산식보다 우선합니다.</p></section>
    <section><h3 className="font-bold">법정 청약철회 및 소비자 권리</h3><p>관계 법령에 따른 청약철회와 하자·계약 불이행·중복 결제·오청구에 대한 권리를 보장합니다. 법정 청약철회는 계약내용 서면 수령일 등 법에서 정한 기산일부터 원칙적으로 7일 이내 가능하며, 공급 시점 등에 따라 기산일이 달라질 수 있습니다. 용역·디지털콘텐츠의 공급 개시나 주문제작에 따른 제한은 법정 요건과 고지·동의 등 필요한 절차를 갖춘 경우에만 적용하며, 미제공 부분과 계약 불이행에 관한 권리를 일괄 배제하지 않습니다.</p><p>표시·광고 또는 계약내용과 다르게 이행된 경우 등 법령이 정한 별도 청약철회 권리도 보장합니다. 법정 청약철회에 임의의 위약금이나 취소 수수료를 부과하지 않습니다.</p></section>
    <section><h3 className="font-bold">신청 및 처리</h3><p>고객센터 전화 <a className="underline" href="tel:01029482728">010-2948-2728</a> 또는 <a className="underline" href="http://pf.kakao.com/_qxmixiX/chat" target="_blank" rel="noreferrer">카카오톡 상담</a>으로 자동갱신 중단 또는 즉시 해지·환불을 요청해 주세요. 계약과 결제 내역을 확인한 후 처리 결과와 정산 근거를 안내합니다. 이 페이지에는 자동 환불 버튼이 없으며 고객센터 접수 방식입니다.</p><p>법정 청약철회에 해당하는 용역·디지털콘텐츠는 청약철회일부터 3영업일 이내 환급 등 법정 기한을 준수합니다. 카드사에 취소를 요청한 시점과 카드 명세에 반영되는 시점은 다를 수 있습니다.</p></section>
    <p>기존 계약에 따른 권리를 불리하게 소급하여 축소하지 않습니다. 관계 법령에서 보장하는 권리가 이 안내보다 우선합니다.</p>
  </div>;
}
