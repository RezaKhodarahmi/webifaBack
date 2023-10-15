const Joi = require("joi");

const UserEditBodyValidation = (body) => {
  const schema = Joi.object({
    id: Joi.number().required(),
    firstName: Joi.string().optional().allow(null, ""),
    lastName: Joi.string().optional().allow(null, ""),
    email: Joi.string().email(),
    phone: Joi.string(),
    password: Joi.string(),
    address: Joi.string().optional().allow(null, ""),
    postalCode: Joi.string().optional().allow(null, ""),
    referralCode: Joi.string().required(),
    credit: Joi.string().required(),
    country: Joi.string().optional().allow(null, ""),
    city: Joi.string().optional().allow(null, ""),
    role: Joi.string(),
    emailVerification: Joi.string(),
    dateOfBirth: Joi.date().allow(null, "", "null"),
    vip: Joi.date().allow(null, "", "null"),
    status: Joi.string(),
    avatar: Joi.string().optional().allow(null, ""),
    image: Joi.string().optional().allow(null, ""),
  });
  return schema.validate(body);
};

const NewUserBodyValidation = (body) => {
  const schema = Joi.object({
    firstName: Joi.string().optional().allow(null, ""),
    lastName: Joi.string().optional().allow(null, ""),
    email: Joi.string().email().required(),
    phone: Joi.string(),
    password: Joi.string().required(),
    address: Joi.string().optional().allow(null, ""),
    postalCode: Joi.string().optional().allow(null, ""),
    country: Joi.string().optional().allow(null, ""),
    city: Joi.string().optional().allow(null, ""),
    role: Joi.string().required(),
    emailVerification: Joi.string(),
    dateOfBirth: Joi.date().optional().allow(null, ""),
    vip: Joi.date().optional().allow(null, ""),
    status: Joi.string().required(),
    image: Joi.string().optional().allow(null, ""),
  });
  return schema.validate(body);
};

const CreateCourseBodyValidation = (body) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    slug: Joi.string().required(),
    description: Joi.string().optional().allow(null, ""),
    abstract: Joi.string().optional().allow(null, ""),
    keywords: Joi.string().optional().allow(null, ""),
    metaTitle: Joi.string().optional().allow(null, ""),
    metaDescription: Joi.string().optional().allow(null, ""),
    type: Joi.string().required(),
    status: Joi.string().required(),
    image: Joi.string().optional().allow(null, ""),
  });
  return schema.validate(body);
};
const GetCourseWithId = (body) => {
  const schema = Joi.object({
    id: Joi.string().required(),
  });
  return schema.validate(body);
};
const UpdateCourseBodyValidation = (body) => {
  const schema = Joi.object({
    id: Joi.string().required(),
    title: Joi.string().required(),
    slug: Joi.string().required(),
    activeList: Joi.string().required(),
    description: Joi.string().optional().allow(null, ""),
    abstract: Joi.string().optional().allow(null, ""),
    keywords: Joi.string().optional().allow(null, ""),
    metaTitle: Joi.string().optional().allow(null, ""),
    metaDescription: Joi.string().optional().allow(null, ""),
    type: Joi.string().required(),
    status: Joi.string().required(),
    image: Joi.string().optional().allow(null, ""),
  });
  return schema.validate(body);
};
const DeleteCourseWithId = (body) => {
  const schema = Joi.object({
    id: Joi.string().required(),
  });
  return schema.validate(body);
};

const CreateCategoryBodyValidation = (body) => {
  const schema = Joi.object({
    parentId: Joi.string(),
    title: Joi.string().required(),
    slug: Joi.string().required(),
    description: Joi.string().optional().allow(null, ""),
    keywords: Joi.string().optional().allow(null, ""),
    metaTitle: Joi.string().optional().allow(null, ""),
    metaDescription: Joi.string().optional().allow(null, ""),
    image: Joi.string().optional().allow(null, ""),
    status: Joi.string().required(),
  });
  return schema.validate(body);
};
const GetCategoryWithId = (body) => {
  const schema = Joi.object({
    id: Joi.string().required(),
  });
  return schema.validate(body);
};
const UpdateCategoryBodyValidation = (body) => {
  const schema = Joi.object({
    id: Joi.string().required(),
    parentId: Joi.string(),
    title: Joi.string().required(),
    slug: Joi.string().required(),
    description: Joi.string().optional().allow(null, ""),
    keywords: Joi.string().optional().allow(null, ""),
    metaTitle: Joi.string().optional().allow(null, ""),
    metaDescription: Joi.string().optional().allow(null, ""),
    image: Joi.string().optional().allow(null, ""),
    status: Joi.string().required(),
  });
  return schema.validate(body);
};

const CreateCycleBodyValidation = (body) => {
  const schema = Joi.object({
    secId: Joi.string().optional().allow(null, ""),
    startDate: Joi.date().optional().allow(null, ""),
    endDate: Joi.date().optional().allow(null, ""),
    vacationStart: Joi.date().optional().allow(null, ""),
    vacationEnd: Joi.date().optional().allow(null, ""),
    regularPrice: Joi.number().optional().allow(null, ""),
    vipPrice: Joi.number().optional().allow(null, ""),
    vipAccess: Joi.string().optional().allow(null, ""),
    retake: Joi.string().optional().allow(null, ""),
    status: Joi.string().optional().allow(null, ""),
  });
  return schema.validate(body);
};
const GetCycleWithId = (body) => {
  const schema = Joi.object({
    id: Joi.string().required(),
  });
  return schema.validate(body);
};
const UpdateCycleBodyValidation = (body) => {
  const schema = Joi.object({
    id: Joi.string().required(),
    startDate: Joi.date().allow(null),
    endDate: Joi.date().allow(null),
    vacationStart: Joi.date().allow(null),
    vacationEnd: Joi.date().allow(null),
    regularPrice: Joi.number().required(),
    vipPrice: Joi.number().required(),
    vipAccess: Joi.string().required(),
    retake: Joi.string().required(),
    status: Joi.string().required(),
  });
  return schema.validate(body);
};

const createNewVideo = (body) => {
  const schema = Joi.object({
    courseId: Joi.string().required(),
    cycleId: Joi.string().required(),
    secId: Joi.string().required(),
    time: Joi.string().optional().allow(null, ""),
    title: Joi.string().required(),
    needEnroll: Joi.string().required(),
  });
  return schema.validate(body);
};

const updateVideoValidation = (body) => {
  const videoSchema = Joi.object({
    id: Joi.string().required(),
    courseId: Joi.string().required(),
    cycleId: Joi.string().required(),
    secId: Joi.string().required(),
    title: Joi.string().required(),
    time: Joi.string().optional().allow(null, ""),
    needEnroll: Joi.string().required(),
  });
  const schema = Joi.array().items(videoSchema);
  return schema.validate(body);
};

const getVideoWithId = (body) => {
  const schema = Joi.object({
    id: Joi.string().required(),
  });
  return schema.validate(body);
};

const deleteVideoWithId = (body) => {
  const schema = Joi.object({
    id: Joi.string().required(),
  });
  return schema.validate(body);
};
const createNewTestBodyValidation = (body) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    courseId: Joi.string().required(),
    cycleId: Joi.string().required(),
    testDate: Joi.string().optional().allow(null, ""),
    testTime: Joi.string().optional().allow(null, ""),
    agenda: Joi.string().optional().allow(null, ""),
    position: Joi.string().required(),
    status: Joi.string().required(),
    needEnroll: Joi.string().required(),
  });
  return schema.validate(body);
};
const updateTestBodyValidation = (body) => {
  const schema = Joi.object({
    id: Joi.string().required(),
    title: Joi.string().required(),
    courseId: Joi.string().required(),
    cycleId: Joi.string().required(),
    testDate: Joi.string().optional().allow(null, ""),
    testTime: Joi.string().optional().allow(null, ""),
    agenda: Joi.string().optional().allow(null, ""),
    position: Joi.string().required(),
    status: Joi.string().required(),
    needEnroll: Joi.string().required(),
  });
  return schema.validate(body);
};
const getTestWithIdBodyValidation = (body) => {
  const schema = Joi.object({
    id: Joi.string().required(),
  });
  return schema.validate(body);
};
const deleteTestWithIdBodyValidation = (body) => {
  const schema = Joi.object({
    id: Joi.string().required(),
  });
  return schema.validate(body);
};
const UpdateQuestionBodyValidation = (body) => {
  const schema = Joi.object({
    testId: Joi.string().required(),
  });
  return schema.validate(body);
};

const createNewPostBodyValidation = (body) => {
  const schema = Joi.object({
    authorId: Joi.string().required(),
    parentId: Joi.string().required(),
    title: Joi.string().required(),
    slug: Joi.string().required(),
    description: Joi.string().optional().allow(null, ""),
    summary: Joi.string().optional().allow(null, ""),
    keywords: Joi.string().optional().allow(null, ""),
    metaTitle: Joi.string().optional().allow(null, ""),
    metaDescription: Joi.string().optional().allow(null, ""),
    published: Joi.string().required(),
    image: Joi.string().optional().allow(null, ""),
  });
  return schema.validate(body);
};
const updatePostBodyValidation = (body) => {
  const schema = Joi.object({
    id: Joi.string().required(),
    authorId: Joi.string().required(),
    parentId: Joi.string().required(),
    title: Joi.string().required(),
    slug: Joi.string().required(),
    description: Joi.string().optional().allow(null, ""),
    summary: Joi.string().optional().allow(null, ""),
    keywords: Joi.string().optional().allow(null, ""),
    metaTitle: Joi.string().optional().allow(null, ""),
    metaDescription: Joi.string().optional().allow(null, ""),
    published: Joi.string().required(),
    image: Joi.string().optional().allow(null, ""),
  });
  return schema.validate(body);
};
const CreateBlogCategoryBodyValidation = (body) => {
  const schema = Joi.object({
    parentId: Joi.string(),
    title: Joi.string().required(),
    slug: Joi.string().required(),
    description: Joi.string().optional().allow(null, ""),
    keywords: Joi.string().optional().allow(null, ""),
    metaTitle: Joi.string().optional().allow(null, ""),
    metaDescription: Joi.string().optional().allow(null, ""),
    image: Joi.string().optional().allow(null, ""),
    status: Joi.string().required(),
  });
  return schema.validate(body);
};
const updateBlogCategoryBodyValidation = (body) => {
  const schema = Joi.object({
    id: Joi.string().required(),
    parentId: Joi.string(),
    title: Joi.string().required(),
    slug: Joi.string().required(),
    description: Joi.string().optional().allow(null, ""),
    keywords: Joi.string().optional().allow(null, ""),
    metaTitle: Joi.string().optional().allow(null, ""),
    metaDescription: Joi.string().optional().allow(null, ""),
    image: Joi.string().optional().allow(null, ""),
    status: Joi.string().required(),
  });
  return schema.validate(body);
};
const CreateTagBodyValidation = (body) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    postId: Joi.string().required(),
  });
  return schema.validate(body);
};
const UpdateTagBodyValidation = (body) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    id: Joi.string().required(),
  });
  return schema.validate(body);
};
const userRegisterBodyValidation = (body) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phone: Joi.string()
      .pattern(/^\(\d{3}\) \d{3}-\d{4}$/)
      .required(),
  });
  return schema.validate(body);
};
const VerifyRegisteredUser = (body) => {
  const schema = Joi.object({
    token: Joi.string().required().label("token"),
  });
  return schema.validate(body);
};

const handelUserUpdate = (body) => {
  const schema = Joi.object({
    firstName: Joi.string().optional().allow(null, ""),
    lastName: Joi.string().optional().allow(null, ""),
    email: Joi.string().email().required(),
    phone: Joi.string(),
    address: Joi.string().optional().allow(null, ""),
    postalCode: Joi.string().optional().allow(null, ""),
    country: Joi.string().optional().allow(null, ""),
    city: Joi.string().optional().allow(null, ""),
    role: Joi.string().required(),
    emailVerification: Joi.string(),
    dateOfBirth: Joi.date().optional().allow(null, ""),
    vip: Joi.date().optional().allow(null, ""),
    status: Joi.string().required(),
    image: Joi.string().optional().allow(null, ""),
  });
  return schema.validate(body);
};
const userWithEmailBodyValidation = (body) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
  });
  return schema.validate(body);
};
const validateCourseCategoryDelete = (body) => {
  const schema = Joi.object({
    catId: Joi.string().required().label("Category Id "),
    courseId: Joi.string().required().label("Course Id "),
  });
  return schema.validate(body);
};
const userLoginValidation = (body) => {
  const schema = Joi.object({
    userEmail: Joi.string().email().required(),
  });
  return schema.validate(body);
};
const handelCheckoutReq = (body) => {
  const schema = Joi.object({
    userId: Joi.string().required(),
    courseId: Joi.number().required(),
    cycleId: Joi.number().required(),
    Stripe_Charge_ID: Joi.string().required(),
    Currency: Joi.string().required(),
    Transaction_Date: Joi.number().required(),
    Transaction_Status: Joi.number().required(),
  });
  return schema.validate(body);
};

const handleCouponCreate = (body) => {
  const schema = Joi.object({
    code: Joi.string().required(),
    discount_percentage: Joi.number().integer().min(1).max(100),
    discount_amount: Joi.number().positive(),
    course_id: Joi.array().items(Joi.number()).allow(null),
    expires_at: Joi.date().allow(null),
    is_used: Joi.boolean().default(false),
    minimum_spend: Joi.number().positive().allow(null),
    maximum_spend: Joi.number().positive().allow(null),
    individual_use_only: Joi.boolean().default(false),
    exclude_products: Joi.array().items(Joi.number()).allow(null),
    allowed_emails: Joi.array().items(Joi.string().email()).allow(null),
    exclude_sale_items: Joi.boolean().default(false),
    usage_limit_per_coupon: Joi.number().integer().min(1).allow(null),
    usage_limit_per_user: Joi.number().integer().min(1).allow(null),
  }).oxor("discount_percentage", "discount_amount"); // Use oxor to ensure only one of them is present
  return schema.validate(body);
};
const handleCouponUpdate = (body) => {
  const schema = Joi.object({
    id: Joi.number().required(),
    code: Joi.string().required(),
    discount_percentage: Joi.number().integer().min(1).max(100),
    discount_amount: Joi.number().positive(),
    course_id: Joi.array().items(Joi.number()).allow(null),
    expires_at: Joi.date().allow(null),
    is_used: Joi.boolean().default(false),
    minimum_spend: Joi.number().positive().allow(null),
    maximum_spend: Joi.number().positive().allow(null),
    individual_use_only: Joi.boolean().default(false),
    exclude_products: Joi.array().items(Joi.number()).allow(null),
    allowed_emails: Joi.array().items(Joi.string().email()).allow(null),
    exclude_sale_items: Joi.boolean().default(false),
    usage_limit_per_coupon: Joi.number().integer().min(1).allow(null),
    usage_limit_per_user: Joi.number().integer().min(1).allow(null),
  }).oxor("discount_percentage", "discount_amount"); // Use oxor to ensure only one of them is present
  return schema.validate(body);
};

const createWebinarValidation = (body) => {
  const schema = Joi.object({
    slug: Joi.string()
      .required()
      .messages({ "string.empty": "Slug is required." }),
    title: Joi.string()
      .required()
      .messages({ "string.empty": "Title is required." }),
    subTitle: Joi.string().optional().allow(null, ""),
    description: Joi.string().optional().allow(null, ""),
    date: Joi.string()
      .required()
      .messages({ "date.base": "A valid date is required." }),
    instructor: Joi.string()
      .required()
      .messages({ "string.empty": "Instructor is required." }),
    regularPrice: Joi.number().optional().allow(null, ""),
    vipPrice: Joi.number().optional().allow(null, ""),
    type: Joi.number().valid(0, 1).required(),
    status: Joi.number().valid(0, 1).required(),
    image: Joi.string().required(),
  });
  return schema.validate(body);
};
const getWebinarWithIdValidation = (params) => {
  const schema = Joi.object({
    id: Joi.number()
      .required()
      .messages({ "number.base": "ID should be a number." }),
  });
  return schema.validate(params);
};
const updateWebinarValidation = (params, body) => {
  const paramSchema = Joi.object({
    id: Joi.number()
      .required()
      .messages({ "number.base": "ID should be a number." }),
  });

  const bodySchema = Joi.object({
    slug: Joi.string().optional(),
    title: Joi.string().optional(),
    subTitle: Joi.string().optional().allow(null, "").optional(),
    description: Joi.string().optional().allow(null, "").optional(),
    date: Joi.string().required(),
    instructor: Joi.string().optional(),
    regularPrice: Joi.number().optional().allow(null, ""),
    vipPrice: Joi.number().optional().allow(null, ""),
    type: Joi.number().valid(0, 1).optional(),
    status: Joi.number().valid(0, 1).optional(),
    image: Joi.string().optional(),
  });

  const paramValidation = paramSchema.validate(params);
  if (paramValidation.error) return paramValidation;

  return bodySchema.validate(body);
};
const deleteWebinarValidation = (params) => {
  return getWebinarWithIdValidation(params); // Reuse the same validation as for getting by ID
};

const checkCouponBodyValidation = (body) => {
  const cycleSchema = Joi.object({
    id: Joi.number().required(),
    name: Joi.string().required(),
    startDate: Joi.string().required(),
    endDate: Joi.string().required(),
    vacationStart: Joi.string().allow(""),
    secId: Joi.string().required(),
    courseId: Joi.number().required(),
    vacationEnd: Joi.string().allow(""),
    regularPrice: Joi.number().required(),
    vipPrice: Joi.number().required(),
    days: Joi.string().required(),
    time: Joi.string().required(),
    vipAccess: Joi.string().required(),
    duration: Joi.string().required(),
    retake: Joi.number().required(),
    status: Joi.string().required(),
    createdAt: Joi.string().required(),
    updatedAt: Joi.string().required(),
    course: Joi.object().required(),
  });

  const referredSchema = Joi.object({
    id: Joi.number().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    referralCode: Joi.string().required(),
  });

  const bodySchema = Joi.object({
    coupon: Joi.string().required(),
    user: Joi.string().email().required(),
    cycles: Joi.array().items(cycleSchema).required(),
    referred: referredSchema.required(),
  });

  return bodySchema.validate(body);
};

const UserProfileUpdateBodyValidation = (body) => {
  const bodySchema = Joi.object({
    firstName: Joi.string().required(),
    id: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    address: Joi.string().optional().allow(null, ""),
    postalCode: Joi.string().optional().allow(null, ""),
    country: Joi.string().optional().allow(null, ""),
    city: Joi.string().optional().allow(null, ""),
    dateOfBirth: Joi.date().optional().allow(null, ""),
    avatar: Joi.string().optional().allow(null, ""),
    language: Joi.string().optional().allow(null, ""),
    timezone: Joi.string().optional().allow(null, ""),
    referralCode: Joi.string().required(),
    vip: Joi.date().allow(null, "", "null"),
    credit: Joi.string().required(),
  });
  return bodySchema.validate(body);
};
module.exports = {
  createNewPostBodyValidation,
  UserEditBodyValidation,
  NewUserBodyValidation,
  CreateCourseBodyValidation,
  GetCourseWithId,
  UpdateCourseBodyValidation,
  DeleteCourseWithId,
  CreateCategoryBodyValidation,
  GetCategoryWithId,
  UpdateCategoryBodyValidation,
  CreateCycleBodyValidation,
  UpdateCycleBodyValidation,
  GetCycleWithId,
  createNewVideo,
  updateVideoValidation,
  getVideoWithId,
  deleteVideoWithId,
  createNewTestBodyValidation,
  getTestWithIdBodyValidation,
  updateTestBodyValidation,
  deleteTestWithIdBodyValidation,
  UpdateQuestionBodyValidation,
  updatePostBodyValidation,
  CreateBlogCategoryBodyValidation,
  updateBlogCategoryBodyValidation,
  CreateTagBodyValidation,
  UpdateTagBodyValidation,
  userRegisterBodyValidation,
  VerifyRegisteredUser,
  handelUserUpdate,
  userWithEmailBodyValidation,
  validateCourseCategoryDelete,
  userLoginValidation,
  handelCheckoutReq,
  handleCouponCreate,
  handleCouponUpdate,
  createWebinarValidation,
  getWebinarWithIdValidation,
  updateWebinarValidation,
  deleteWebinarValidation,
  checkCouponBodyValidation,
  UserProfileUpdateBodyValidation,
};
