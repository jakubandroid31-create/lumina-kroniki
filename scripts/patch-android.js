// Dostosowuje wygenerowany projekt Androida (Lumina): orientacja pozioma, pełny ekran (immersive), ekran nie gaśnie.
const fs = require('fs');
const path = require('path');

const manifest = 'android/app/src/main/AndroidManifest.xml';
let xml = fs.readFileSync(manifest, 'utf8');
if (!xml.includes('screenOrientation')) {
  xml = xml.replace(/<activity\b/, '<activity android:screenOrientation="sensorLandscape"');
  fs.writeFileSync(manifest, xml);
  console.log('Ustawiono orientację poziomą.');
}

function find(dir, name) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) { const r = find(p, name); if (r) return r; }
    else if (f.name === name) return p;
  }
  return null;
}
const main = find('android/app/src/main/java', 'MainActivity.java');
if (main) {
  const pkg = fs.readFileSync(main, 'utf8').match(/package\s+([\w.]+);/)[1];
  fs.writeFileSync(main, `package ${pkg};

import android.view.WindowManager;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  public void onResume() {
    super.onResume();
    immersive();
  }

  @Override
  public void onWindowFocusChanged(boolean hasFocus) {
    super.onWindowFocusChanged(hasFocus);
    if (hasFocus) immersive();
  }

  private void immersive() {
    getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
    WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
    WindowInsetsControllerCompat c = WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView());
    c.hide(WindowInsetsCompat.Type.systemBars());
    c.setSystemBarsBehavior(WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
  }
}
`);
  console.log('Włączono tryb pełnoekranowy w MainActivity.');
}
