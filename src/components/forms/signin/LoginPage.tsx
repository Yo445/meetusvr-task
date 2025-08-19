import React, { useState } from "react";
import { GradientCircle } from "../../custom/GradientCircle";
import { InputField } from "../../custom/InputField";
import { Lock, Mail } from "@/assets/icons/icons";

const designImages = {
  element04: "figma:asset/9e4298a54af78a8be9b2851a140ca8232f42ded4.png",
  element02: "figma:asset/b74714317592c3c8176c99baddf62febe0e276d0.png",
  logo3d: "figma:asset/9039681aa3afd99677ad4b38d7a998cc976b0092.png",
};

function DesignElements() {
  return (
    <div className="hidden lg:block absolute h-[1024px] left-[614px] overflow-clip top-0 w-[826px]">
      <div
        className="absolute bg-[86.62%_50%] bg-no-repeat bg-size-[150.23%_157.14%] h-[75px] top-[661px] translate-x-[-50%] w-[413px]"
        style={{
          left: "calc(50% - 36.5px)",
          backgroundImage: `url('${designImages.logo3d}')`,
        }}
      />
      <div className="absolute h-[523px] left-[-6px] top-[138px] w-[744px]">
        <div
          className="absolute flex h-[524.341px] items-center justify-center translate-x-[-50%] translate-y-[-50%] w-[753.494px]"
          style={{ top: "calc(50% - 0.323px)", left: "calc(50% + 10.753px)" }}
        >
          <div className="flex-none rotate-[338.39deg]">
            <div
              className="bg-center bg-cover bg-no-repeat h-[288.166px] w-[696.322px]"
              style={{ backgroundImage: `url('${designImages.element04}')` }}
            />
          </div>
        </div>
        <div className="absolute flex h-[2104.952px] items-center justify-center left-[-680px] top-[-791px] w-[2104.174px]">
          <div className="flex-none rotate-[339.144deg]">
            <div
              className="bg-center bg-cover bg-no-repeat h-[1631.49px] w-[1630.16px]"
              style={{ backgroundImage: `url('${designImages.element02}')` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    if (email && password) {
      console.log("Login attempt:", {
        email,
        password: "*".repeat(password.length),
      });
    }
  };

  return (
    <div className="absolute h-[1024px] left-10 overflow-clip top-0 w-[554px] flex items-center">
      <div className="w-full max-w-[400px] mx-auto flex flex-col gap-9 items-center">
        <div className="text-center">
          <h1 className="text-[#1a1a1e] text-[56px] font-['ABeeZee:Regular',_sans-serif] mb-2">
            Welcome back
          </h1>
          <p className="text-[#62626b] text-[18px] font-['ABeeZee:Regular',_sans-serif] leading-[1.55]">
            Step into our shopping metaverse for an unforgettable shopping
            experience
          </p>
        </div>

        <div className="w-full space-y-5">
          <InputField
            icon={<Mail/>}
            placeholder="Email"
            type="email"
            value={email}
            onChange={setEmail}
          />
          <InputField
            icon={<Lock/>}
            placeholder="Password"
            type="password"
            value={password}
            onChange={setPassword}
          />
        </div>

        <button
          onClick={handleSubmit}
          className="bg-[#9414ff] hover:bg-[#8312e6] transition-colors duration-200 relative rounded-lg shrink-0 w-full"
        >
          <div className="flex flex-row items-center justify-center relative size-full">
            <div className="box-border content-stretch flex gap-1 items-center justify-center px-5 py-3 relative w-full">
              <div className="font-['ABeeZee:Regular',_sans-serif] leading-normal not-italic text-[#ffffff] text-[16px]">
                Login
              </div>
            </div>
          </div>
        </button>

        <p className="text-[14px] text-[#62626b] font-['ABeeZee:Regular',_sans-serif] hover:text-[#1a1a1e] transition-colors duration-200 cursor-pointer">
          Don't have an account? <span className="underline">Sign up</span>
        </p>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <div className="bg-[#e9ecf2] relative size-full">
      {/* Background gradient circles */}
      <GradientCircle
        className="absolute left-[38px] size-[807px] top-[-372px]"
        color="#9E77F6"
        radius={1203.5}
        blur={400}
      />
      <GradientCircle
        className="absolute left-[-117px] size-[813px] top-[646px]"
        color="#B0D2E5"
        radius={1206.5}
        blur={400}
      />
      <GradientCircle
        className="absolute size-[667px] top-[667px] left-[75%]"
        color="#9E77F6"
        radius={733.5}
        blur={200}
      />
      <GradientCircle
        className="absolute size-[667px] top-[-247px] left-[41.667%]"
        color="#E477F6"
        radius={733.5}
        blur={200}
      />

      {/* Main container */}
      <div className="absolute backdrop-blur-[4.5px] backdrop-filter bg-[rgba(255,255,255,0.3)] h-[1024px] left-0 rounded-[20px] top-0 w-[1440px]">
        <div className="h-[1024px] overflow-clip relative w-[1440px]">
          <DesignElements />
          <LoginForm />
        </div>
        <div
          aria-hidden="true"
          className="absolute border-[#ffffff] border-[2.5px] border-solid inset-0 pointer-events-none rounded-[20px]"
        />
      </div>
    </div>
  );
}
