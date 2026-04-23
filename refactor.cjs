const fs = require('fs');
let code = fs.readFileSync('frontend/components/auth/LoginModal.tsx', 'utf8');

code = code.replace(
  'const [loading, setLoading] = useState(false);',
  `const [loading, setLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState<"form" | "google" | "resend" | "none">("none");

  const startLoading = (action: "form" | "google" | "resend") => {
    setLoadingAction(action);
    setLoading(true);
  };
  const stopLoading = () => {
    setLoadingAction("none");
    setLoading(false);
  };`
);

let lines = code.split('\n');

// We map which line numbers have setLoading(true) to their replacement
let replacements = {
  322: '    startLoading("form");',
  335: '    startLoading("form");',
  357: '    startLoading("resend");',
  374: '    startLoading("form");',
  401: '    startLoading("form");',
  414: '    startLoading("google");',
  470: '    startLoading("google");',
  491: '    startLoading("form");',
  528: '    startLoading("form");',
  555: '    startLoading("resend");',
  572: '    startLoading("form");'
};

for (let i = 0; i < lines.length; i++) {
  // Replace setLoading(false) with stopLoading() everywhere
  if (lines[i].includes('setLoading(false)')) {
    lines[i] = lines[i].replace(/setLoading\(false\)/g, 'stopLoading()');
  }
}

code = lines.join('\n');

// Replace specific setLoading(true) by simple match
code = code.replace(/setLoading\(true\);/gm, (match, offset) => {
    // Find what function we are in
    let before = code.substring(0, offset);
    if (before.includes('handleGoogleSignIn') && offset - before.lastIndexOf('handleGoogleSignIn') < 300) return 'startLoading("google");';
    if (before.includes('handleGoogleNewUserComplete') && offset - before.lastIndexOf('handleGoogleNewUserComplete') < 300) return 'startLoading("google");';
    if (before.includes('handleResend') && offset - before.lastIndexOf('handleResend') < 300) return 'startLoading("resend");';
    if (before.includes('handleForgotResend') && offset - before.lastIndexOf('handleForgotResend') < 300) return 'startLoading("resend");';
    return 'startLoading("form");';
});

// PrimaryButton
code = code.replace(/<PrimaryButton\s+loading=\{loading\}/g, '<PrimaryButton loading={loadingAction === "form"} disabled={loading}');
// PrimaryButton with disabled (line 828, 1113)
code = code.replace(/<PrimaryButton loading=\{loadingAction === "form"\} disabled=\{loading\} label="Verify & Continue" loadingLabel="Verifying…" disabled=\{otp\.length !== 6\} \/>/g, 
  '<PrimaryButton loading={loadingAction === "form"} label="Verify & Continue" loadingLabel="Verifying…" disabled={loading || otp.length !== 6} />');

code = code.replace(/<PrimaryButton loading=\{loadingAction === "form"\} disabled=\{loading\} label="Reset Password" loadingLabel="Resetting…" disabled=\{forgotOtp\.length !== 6\} \/>/g, 
  '<PrimaryButton loading={loadingAction === "form"} label="Reset Password" loadingLabel="Resetting…" disabled={loading || forgotOtp.length !== 6} />');

// GoogleButton
code = code.replace(/<GoogleButton\s+onClick=\{handleGoogleSignIn\}\s+loading=\{loading\}/g, '<GoogleButton onClick={handleGoogleSignIn} loading={loadingAction === "google"} disabled={loading}');

// Modify GoogleButton component definition
let gbDef = `function GoogleButton({ onClick, loading, label }: { onClick: () => void; loading: boolean; label: string }) {`;
let gbNewDef = `function GoogleButton({ onClick, loading, disabled, label }: { onClick: () => void; loading: boolean; disabled?: boolean; label: string }) {`;
code = code.replace(gbDef, gbNewDef);

code = code.replace(
  '        disabled={loading}',
  '        disabled={loading || disabled}'
);

let svgSearch = `<svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">`;
let svgReplace = `{loading ? (
          <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin shrink-0" />
        ) : (
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true" className="shrink-0">`;

let svgEnd = `          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />\n        </svg>`;
let svgEndReplace = `          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />\n        </svg>\n        )}`;

// Apply GoogleButton replacement safely
let gbTokens = code.split(svgSearch);
if (gbTokens.length === 2) { // exactly one occurrence
  let laterPart = gbTokens[1].replace('</svg>', '</svg>\n        )}');
  code = gbTokens[0] + svgReplace + laterPart;
}

fs.writeFileSync('frontend/components/auth/LoginModal.tsx', code);
