# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing any code.

# ビルドポリシー

**AndroidビルドはローカルのGradleで行う。EASクラウドビルドは使用禁止（料金がかかるため）。**
**`eas build --local` はWindows非対応なので使わない。**

## Windowsでのローカルビルド手順

```powershell
# 1. Androidネイティブコード生成（初回・依存変更時のみ）
npx expo prebuild --platform android --clean

# 2. abiFilters設定（必須）
# android/app/build.gradle の defaultConfig に追加:
#   ndk {
#       abiFilters "arm64-v8a"
#   }
# ※これをしないとx86ビルドがタイムアウトで失敗する

# 3. JAVA_HOMEを正しいパスに設定
$env:JAVA_HOME = "F:\Program\Java\jdk17\jdk-17.0.0.1"

# 4. Gradleでリリースビルド
cd android
.\gradlew.bat assembleRelease

# 5. APKをbuildsフォルダにコピー
Copy-Item "android\app\build\outputs\apk\release\app-release.apk" "F:\work\personal-app-dev\builds\<AppName>.apk"
```

必要環境（設定済み）:
- Java JDK 17: `F:\Program\Java\jdk17\jdk-17.0.0.1`
- Android SDK: `ANDROID_HOME=F:\android_sdk`

注意: `android/` フォルダは `.gitignore` に追加すること（prebuildで毎回再生成）
