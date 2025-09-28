interface TimerDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  timerName?: string;
}

const TimerDeleteModal: React.FC<TimerDeleteModalProps> = ({
  isOpen,
  onClose,
  onDelete,
  timerName,
}) => {
  const handleCancel = () => {
    onClose();
  };

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-5" // px-5 추가로 모바일 여백
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(2px)',
      }}
      onClick={handleOverlayClick}
    >
      {/* 모달 컨테이너 */}
      <div className="relative">
        <div style={{ width: '273px', height: '86px', position: 'relative' }}>
          {' '}
          {/* 높이 98 → 86으로 축소 */}
          {/* 상단 메시지 영역 - 패딩 축소 */}
          <div
            style={{
              width: 273,
              height: 42, // 54 → 42로 축소 (12px 줄임)
              position: 'absolute',
              top: 0,
              left: 0,
              background: 'rgba(242, 242, 242, 0.80)',
              borderTopLeftRadius: 14,
              borderTopRightRadius: 14,
              backdropFilter: 'blur(11px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px 12px', // 패딩 추가로 텍스트 여백 조정
            }}
          >
            <div
              style={{
                textAlign: 'center',
                color: 'black',
                fontSize: 15, // 16 → 15로 살짝 축소
                fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
                fontWeight: '600',
                lineHeight: '20px', // 22 → 20으로 축소
              }}
            >
              {timerName ? `"${timerName}" 타이머를 삭제하시겠습니까?` : '타이머 삭제하시겠습니까?'}
            </div>
          </div>
          {/* 취소 버튼 */}
          <button
            onClick={handleCancel}
            style={{
              width: 136,
              height: 44,
              position: 'absolute',
              left: 0,
              top: 42, // 54 → 42로 조정
              background: 'rgba(242, 242, 242, 0.80)',
              borderBottomLeftRadius: 14,
              borderTop: '0.50px solid #D3D4DA',
              borderRight: '0.50px solid #D3D4DA',
              backdropFilter: 'blur(11px)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = 'rgba(242, 242, 242, 0.90)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = 'rgba(242, 242, 242, 0.80)')
            }
          >
            <div
              style={{
                textAlign: 'center',
                color: '#0D79E4',
                fontSize: 16,
                fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
                fontWeight: '500',
                lineHeight: '22px',
              }}
            >
              취소
            </div>
          </button>
          {/* 삭제 버튼 */}
          <button
            onClick={handleDelete}
            style={{
              width: 136,
              height: 44,
              position: 'absolute',
              left: 137,
              top: 42, // 54 → 42로 조정
              background: 'rgba(242, 242, 242, 0.80)',
              borderBottomRightRadius: 14,
              borderLeft: '0.50px solid #e8e8eb',
              borderTop: '0.50px solid #D3D4DA',
              backdropFilter: 'blur(11px)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = 'rgba(242, 242, 242, 0.90)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = 'rgba(242, 242, 242, 0.80)')
            }
          >
            <div
              style={{
                textAlign: 'center',
                color: '#DA4B56',
                fontSize: 16,
                fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
                fontWeight: '600',
                lineHeight: '22px',
              }}
            >
              삭제
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimerDeleteModal;
