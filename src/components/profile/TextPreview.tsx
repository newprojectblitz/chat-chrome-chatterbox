
interface TextPreviewProps {
  font: string;
  color: string;
  fontSize: string;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
}

export const TextPreview = ({
  font,
  color,
  fontSize,
  isBold,
  isItalic,
  isUnderline,
}: TextPreviewProps) => {
  return (
    <div className="mt-6">
      <div className="text-sample p-3 retro-inset">
        <h3 className="font-bold mb-2">Text Preview</h3>
        <p style={{
          fontFamily: font === 'comic' ? 'Comic Neue' : 
                    font === 'typewriter' ? 'Courier New' : 
                    'system-ui',
          color: color,
          fontSize: fontSize === 'small' ? '0.9rem' : 
                   fontSize === 'large' ? '1.1rem' : '1rem',
          fontWeight: isBold ? 'bold' : 'normal',
          fontStyle: isItalic ? 'italic' : 'normal',
          textDecoration: isUnderline ? 'underline' : 'none'
        }}>
          This is how your text will look in the chat!
        </p>
      </div>
    </div>
  );
};
