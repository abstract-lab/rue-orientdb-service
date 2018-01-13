"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const main_module_1 = require("./modules/main.module");
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        const port = Number.parseInt(process.env.NODE_PORT) || 3001;
        const app = yield core_1.NestFactory.create(main_module_1.MainModule);
        yield app.listen(port);
        console.log(`OrientDb service listening on port ${port}`);
    });
}
bootstrap();
//# sourceMappingURL=app.js.map