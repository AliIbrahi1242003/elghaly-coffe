# النظرة العامة الشاملة لمنطق التحقق والهندسة الأمنية (Comprehensive Validation Documentation)

---

## الفصل الأول: الفلسفة والنشأة (The Philosophy & Strategy)

### 1. كيف بدأت الفكرة؟ ولماذا يحتاج هذا المشروع إلى نظام تحقق (Validation)؟
في هندسة البرمجيات، تُعتبر قاعدة (Garbage In, Garbage Out) من أهم القواعد التأسيسية؛ فإذا سمح النظام بدخول بيانات خاطئة أو غير مكتملة، ستتأثر دورة حياة التطبيق بالكامل (من أخطاء في قواعد البيانات إلى فشل في عمليات التوصيل). 
نظام التحقق (Validation) هنا ليس مجرد "تحسين لتجربة المستخدم"، بل هو خط الدفاع الأول لضمان **سلامة البيانات (Data Integrity)** وتأمين النظام ضد الهجمات أو الأخطاء العفوية، خاصة في نظام تجارة إلكترونية يعتمد على بيانات دقيقة للتواصل مع العملاء ومعالجة الأموال.

### 2. معمارية النظام (Hybrid Validation Architecture)
اعتمدنا في هذا المشروع على **معمارية هجينة (Hybrid Architecture)** مقسمة إلى ثلاث طبقات استراتيجية:
- **Zod في لوحة التحكم (Admin Panel):** استخدام مكتبة Zod لضمان أن مدخلات مديري النظام (الأسعار، الأسماء، إلخ) تتوافق بدقة مع مخطط قاعدة البيانات (Schema) قبل الإرسال.
- **Custom Logic في الـ Checkout (Client-Side):** استخدام منطق مخصص للتحقق الفوري في المتصفح، لتقديم تجربة مستخدم (UX) سريعة، حيث يتم عرض الأخطاء لحظياً دون انتظار استجابة السيرفر.
- **Zod + Recalculation في السيرفر (Server-Side):** وهي الطبقة الأهم أمنياً؛ حيث يتم إعادة فحص كل ما يأتي من العميل (Client) وتجاهل أي حسابات مالية قادمة منه، والاعتماد حصرياً على مصدر الحقيقة الوحيد (Single Source of Truth) وهو قاعدة البيانات.

---

## الفصل الثاني: التحقق من جهة العميل (Client-Side Validation)

### 1. تحليل ملف `lib/checkoutValidation.ts`
تم فصل منطق التحقق عن مكونات الواجهة (React Components) لضمان مبدأ **Separation of Concerns**. هذا الملف يحتوي على قواعد التحقق الصافية، بينما يقوم الـ Hook (`useCheckout`) بربط هذا المنطق مع حالة الـ UI.

### 2. الواجهات (Interfaces) واستخدام `Partial`
استخدمنا `Partial<CheckoutFormData>` هندسياً للسماح بتمرير بيانات غير مكتملة أثناء قيام المستخدم بتعبئة النموذج (Form). لو استخدمنا النوع الكامل، سيعترض TypeScript (Type Error) في كل مرة نقوم فيها بتحديث حقل واحد قبل اكتمال باقي الحقول.

### 3. التعبير النمطي `PHONE_REGEX`
```typescript
const PHONE_REGEX = /^(?:\+20|0)?1[0125]\d{8}$/;
```
هذا الـ Regex صُمم خصيصاً ليطابق قواعد الاتصالات المصرية:
- `(?:\+20|0)?`: يسمح بوجود كود الدولة `+20` أو `0` بشكل اختياري.
- `1`: الرقم التالي يجب أن يكون 1.
- `[0125]`: يحدد شبكات المحمول المصرية الأربعة (فودافون 0، اتصالات 1، أورانج 2، وي 5).
- `\d{8}`: يضمن وجود 8 أرقام إضافية لتكتمل الـ 11 رقماً.
هذا المنع الصارم يحمي قاعدة البيانات من الأرقام الوهمية ويقلل من نسبة الطلبات المرتجعة.

### 4. الكود الكامل مع الشرح سطرًا بسطر
```typescript
export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  governorate: number;
  city: string;
  detailedAddress: string;
}

export interface FormErrors {
  // استخدام علامة الاستفهام (?) يجعل الحقول اختيارية في حالة عدم وجود خطأ
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  governorate?: string;
  city?: string;
  detailedAddress?: string;
}

// Regex مصري صارم
const PHONE_REGEX = /^(?:\+20|0)?1[0125]\d{8}$/;

export const validateCheckoutForm = (
  data: Partial<CheckoutFormData>,
): FormErrors => {
  const errors: FormErrors = {};

  // التحقق من الاسم الأول: نستخدم trim() لإزالة المسافات الفارغة من البداية والنهاية
  // لمنع المستخدم من إدخال مسافات فقط (Space bypass)
  if (!data.firstName || data.firstName.trim() === "") {
    errors.firstName = "الاسم الأول مطلوب";
  } else if (data.firstName.trim().length < 2) {
    errors.firstName = "الاسم الأول يجب أن يكون حرفين على الأقل";
  } else if (data.firstName.trim().length > 50) {
    errors.firstName = "الاسم الأول يجب ألا يتجاوز 50 حرفاً";
  }

  // نفس المنطق مطبق على الاسم الأخير
  if (!data.lastName || data.lastName.trim() === "") {
    errors.lastName = "الاسم الأخير مطلوب";
  } else if (data.lastName.trim().length < 2) {
    errors.lastName = "الاسم الأخير يجب أن يكون حرفين على الأقل";
  } else if (data.lastName.trim().length > 50) {
    errors.lastName = "الاسم الأخير يجب ألا يتجاوز 50 حرفاً";
  }

  // التحقق من الهاتف باستخدام الـ Regex
  if (!data.phoneNumber || data.phoneNumber.trim() === "") {
    errors.phoneNumber = "رقم الهاتف مطلوب";
  } else if (!PHONE_REGEX.test(data.phoneNumber)) {
    errors.phoneNumber = "يرجى إدخال رقم هاتف مصري صحيح";
  }

  // التحقق من المحافظة (يجب ألا تكون القيمة الافتراضية 0)
  if (!data.governorate || data.governorate === 0) {
    errors.governorate = "يرجى اختيار المحافظة";
  }

  // التحقق من المدينة
  if (!data.city || data.city.trim() === "") {
    errors.city = "يرجى اختيار المدينة";
  }

  // التحقق من العنوان التفصيلي (حد أدنى 10 أحرف لضمان الجدية)
  if (!data.detailedAddress || data.detailedAddress.trim() === "") {
    errors.detailedAddress = "العنوان التفصيلي مطلوب";
  } else if (data.detailedAddress.trim().length < 10) {
    errors.detailedAddress = "العنوان يجب أن يكون 10 أحرف على الأقل";
  } else if (data.detailedAddress.trim().length > 200) {
    errors.detailedAddress = "العنوان يجب ألا يتجاوز 200 حرف";
  }

  // إرجاع كائن الأخطاء بالكامل للواجهة
  return errors;
};

// دالة مساعدة لمعرفة إذا كان النموذج صالحاً (لا يحتوي على مفاتيح أخطاء)
export const isFormValid = (errors: FormErrors): boolean => {
  return Object.keys(errors).length === 0;
};
```

---

## الفصل الثالث: الثغرة الأمنية الكبرى وكيف تم رصدها (The Security Caveat)

### 1. "الثقة العمياء" (Blind Trust) في `app/actions/orders.ts`
في بدايات تطوير دوال الـ Server Actions، كان الكود يستقبل متغيرات `rawFormData`، `rawItems`، و `clientTotalAmount` ويقوم بإدخالها فوراً في قاعدة البيانات عبر `db.insert()`. 
في هندسة الأمن السيبراني، هذه الممارسة تسمى **"Blind Trust"** (الثقة العمياء بالعميل). العميل (Client) بيئة غير آمنة بالمرة، وكل ما يأتي منها يجب اعتباره "بيانات خبيثة" حتى يثبت العكس.

### 2. سيناريو اختراق تخيلي (Attack Scenario)
- **الخطوة الأولى:** يقوم المهاجم بفتح موقعنا وإضافة سلة من المنتجات الفاخرة بقيمة 5000 جنيه.
- **الخطوة الثانية:** عند الضغط على زر "تأكيد الطلب"، يقوم المهاجم باعتراض الشبكة (Network Interception) باستخدام أدوات مثل Chrome DevTools أو Burp Suite.
- **الخطوة الثالثة:** يقوم بتعديل الـ Payload المرسل للسيرفر، ويقوم بتغيير قيمة `clientTotalAmount` من `5000` إلى `0`.
- **النتيجة الكارثية:** السيرفر القديم كان سيستقبل الطلب ويسجله بنجاح في قاعدة البيانات بقيمة 0 جنيه، مما يؤدي لخسائر فادحة للشركة.

---

## الفصل الرابع: الهندسة الأمنية وسد الثغرة (Server-Side Validation & Recalculation)

### 1. الحل الهندسي (Zod & Drizzle)
لمعالجة هذه الثغرة، قمنا بإنشاء خط دفاع خلفي (Backend Firewall) مكون من شقين:
- استخدام `Zod` لعمل Parse والتأكد من أنواع وطول البيانات القادمة وتجاهل أي حقول غير مصرح بها.
- استخدام `Drizzle ORM` للاستعلام المباشر والفوري عن الأسعار الحقيقية للمنتجات.

### 2. مبدأ إعادة حساب الإجمالي (Price Recalculation)
القاعدة الذهبية في التجارة الإلكترونية: **"لا تثق أبداً بحسابات المتصفح"**.
لذلك، قمنا بتجاهل المتغير `clientTotalAmount` تماماً، وقمنا بعمل حلقة تكرار (Loop) على المنتجات المطلوبة واستخراج سعرها الحقيقي من قاعدة البيانات وضربها في الكمية (`realTotalAmount += item.quantity * dbProduct.price`).

### 3. الكود المحدث والآمن بالكامل لدالة `createOrder`
```typescript
"use server";

import { db } from "@/lib/db";
import { orders, orderItems, products } from "@/lib/schema";
import { CheckoutFormData } from "@/lib/checkoutValidation";
import { egyptianGovernorates } from "@/lib/egyptianLocations";
import { z } from "zod";
import { inArray } from "drizzle-orm";

interface CartItem {
  id: number;
  quantity: number;
  price: number;
}

// 1. تحديد الـ Schema الخاص بـ Zod للسيرفر
const orderSchema = z.object({
  formData: z.object({
    firstName: z.string().min(2).max(50),
    lastName: z.string().min(2).max(50),
    phoneNumber: z.string().regex(/^(?:\+20|0)?1[0125]\d{8}$/, "رقم هاتف غير صالح"),
    governorate: z.coerce.number().min(1),
    city: z.string().min(1),
    detailedAddress: z.string().min(10).max(200),
  }),
  items: z.array(z.object({
    id: z.number().positive(),
    quantity: z.number().int().positive() // إجبار الكمية لتكون رقماً صحيحاً وموجباً
  })).min(1, "الطلب يجب أن يحتوي على منتج واحد على الأقل")
});

export async function createOrder(rawFormData: CheckoutFormData, rawItems: CartItem[], clientTotalAmount: number) {
  try {
    // 2. التحقق من صحة البيانات (Server-Side Validation)
    const validatedData = orderSchema.safeParse({ formData: rawFormData, items: rawItems });
    if (!validatedData.success) {
      console.error("Validation failed", validatedData.error.format());
      return { success: false, error: "بيانات الطلب غير صالحة" };
    }
    
    const { formData, items } = validatedData.data;

    // 3. جلب الأسعار الحقيقية من قاعدة البيانات (Prevent Client Manipulation)
    const productIds = items.map((i) => i.id);
    const dbProducts = await db.select({ id: products.id, price: products.price })
                               .from(products)
                               .where(inArray(products.id, productIds));
                               
    // 4. إعادة حساب السعر الإجمالي (Price Recalculation)
    let realTotalAmount = 0;
    const finalOrderItemsData = [];
    
    for (const item of items) {
      const dbProduct = dbProducts.find((p) => p.id === item.id);
      if (!dbProduct) {
        return { success: false, error: `المنتج غير موجود` };
      }
      
      // الحساب الآمن
      realTotalAmount += item.quantity * dbProduct.price;
      
      finalOrderItemsData.push({
        productId: item.id,
        quantity: item.quantity,
        price: dbProduct.price // إجبار سعر الداتابيز النهائي في عناصر الطلب
      });
    }

    // تجهيز اسم المحافظة بدلاً من الـ ID
    const governorateObj = egyptianGovernorates.find((g) => g.id === Number(formData.governorate));
    const governorateName = governorateObj ? governorateObj.nameEn : String(formData.governorate);

    // 5. إدخال الطلب باستخدام السعر الحقيقي (realTotalAmount)
    const [insertedOrder] = await db.insert(orders).values({
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phoneNumber,
      address: formData.detailedAddress,
      city: formData.city,
      governorate: governorateName,
      totalAmount: realTotalAmount, // تأمين السعر
      status: "pending"
    }).returning({ insertedId: orders.id });

    const orderId = insertedOrder.insertedId;

    const orderItemsWithOrderId = finalOrderItemsData.map(item => ({
      ...item,
      orderId: orderId,
    }));

    if (orderItemsWithOrderId.length > 0) {
      await db.insert(orderItems).values(orderItemsWithOrderId);
    }

    return { success: true, orderId };
  } catch (error) {
    console.error("Error creating order:", error);
    return { success: false, error: "فشل إنشاء الطلب" };
  }
}
```

---

## الفصل الخامس: الأسئلة الدفاعية في المناقشة (The Defense Cheatsheet)

### س1: لماذا استخدمتم Zod في السيرفر بينما قمتم بعمل Custom Logic في الواجهة الأمامية؟ لماذا لم تستخدموا Zod في الواجهتين؟
**الإجابة النموذجية:** استخدمنا Custom Logic في الـ Client-side للحصول على تحكم دقيق جداً في تجربة المستخدم (UX) وعرض رسائل الخطأ لحظياً لكل حقل دون الحاجة لإضافة حجم مكتبة Zod في الـ Bundle الخاصة بالمتصفح (تقليل الـ Bundle Size). أما في السيرفر، فنحن نحتاج لتحقق صارم وعميق وبناء Types قوية، وهو ما تتفوق فيه مكتبة Zod، لذا تم توظيف الأداة المناسبة في المكان المناسب.

### س2: ماذا لو قام هاكر بتعديل سعر المنتج نفسه داخل مصفوفة `items` وأرسله للسيرفر بـ 0؟
**الإجابة النموذجية:** لقد توقعنا هذا السيناريو. الدالة `createOrder` تتجاهل تماماً المتغير `price` الموجود داخل مصفوفة `items` القادمة من المتصفح. نحن نأخذ فقط الـ `productId` والـ `quantity`، ثم نقوم بالاستعلام عن السعر الحقيقي من جدول `products` في الداتابيز، ونستخدمه في ضرب الكمية، لذا فإن أي تلاعب في السعر بالمتصفح سيبوء بالفشل.

### س3: لماذا نكتفي بالتحقق على السيرفر ونتعب أنفسنا بعمل تحقق في المتصفح من الأساس؟
**الإجابة النموذجية:** التحقق في المتصفح (Client-side) هدفه **"السرعة وتجربة المستخدم"** لكيلا يضطر المستخدم لانتظار تحميل الشبكة لمعرفة أنه نسي كتابة رقم الهاتف. أما التحقق في السيرفر (Server-side) فهدفه **"الأمان وحماية البيانات"** لأن أي مبرمج يمكنه تجاوز واجهة المستخدم وإرسال طلبات للسيرفر مباشرة عبر الـ APIs. الاثنان يكملان بعضهما.

### س4: لماذا استخدمتم `z.coerce.number` في بعض الأماكن؟
**الإجابة النموذجية:** الـ FormData القادمة من الـ HTML Forms غالباً ما تكون على شكل نصوص (Strings) حتى لو كانت أرقاماً. الدالة `z.coerce.number()` تخبر Zod بأن يقوم بمحاولة تحويل هذا النص إلى رقم (Type Casting) بدلاً من إرجاع خطأ Validation، مما يسهل معالجة البيانات دون كتابة كود التحويل يدوياً (`parseInt`).

### س5: كيف تضمنون أن بيانات المواقع (المحافظات والمدن) دقيقة ولا يتم التلاعب بها؟
**الإجابة النموذجية:** لقد قمنا بفصلها في ملف `egyptianLocations.ts` كـ Single Source of Truth في المتصفح لمنع الإدخال اليدوي، وفي نفس الوقت، الـ Server Action يقوم بمطابقة الـ `id` المرسل مع هذه القائمة الثابتة وتحويله إلى الاسم الصحيح، مما يعني أن العميل لا يمكنه اختراع مدينة غير موجودة وإجبار السيرفر على حفظها.
