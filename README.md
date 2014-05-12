http://soplana.hateblo.jp/entry/2014/03/01/231008
http://dim5.net/angularjs/routeprovider-template.html

service: ある程度まとまった関数群をまとめたUtilオブジェクト向け
factory: ビジネスロジックをしっかり書いたりするようなモデル向け

グローバルに近い値、複数コントローラで共有した値がある場合
value, constant
configフェーズでInjectして利用したい場合
constant
ステートレスなビジネスロジックを作成したい、またはユーティリティクラスを作成した場合
service
ステートフルなビジネスロジックを作成した場合
factory

ng-init

http://qiita.com/opengl-8080/items/2fe0a20c314b1c824cc5