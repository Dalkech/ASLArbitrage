import { reactive, ReactiveObject } from "../../ts/core";

export default class Score 
{
    private state:ReactiveObject<{ 
		msg: string 
		isActive : boolean
		isDisabled : boolean
	}> = undefined as any;
	
	private OnclickChangeMsg = () => 
	{
		if(this.state.msg == "Hello")
			this.state.msg = "Goodbye";
		else
			this.state.msg = "Hello";
	}

	private OnclickToggleActive = () => this.state.isActive = !this.state.isActive;

	private OnclickToggleDisabled = () => this.state.isDisabled = !this.state.isDisabled;
    
	constructor() {
		this.state = reactive({
			msg: "Hello",
			isActive: false,
			isDisabled : false
		});
        this.bindWatchers();
        this.bindButtons();
        console.info("Score is instantiate");
    }

	private bindWatchers() {
		this.state.watchMsg((next) => console.log(`MSG changed for ${next}`));
		this.state.watchIsActive((next) => console.log(`isActive changed for ${next}`));
		this.state.watchIsDisabled((next) => console.log(`isDisabled changed for ${next}`));
	}
    
	private bindButtons = () => {
        document.querySelectorAll('button[type="button"][data-binding="on-click-change-msg"]')
            ?.forEach(button => 
                button.addEventListener('click', () => this.OnclickChangeMsg()))

		document.querySelectorAll('button[type="button"][data-binding="toggle-active"]')
            ?.forEach(button => 
                button.addEventListener('click', () => this.OnclickToggleActive()))
		
		document.querySelectorAll('button[type="button"][data-binding="toggle-disabled"]')
            ?.forEach(button => 
                button.addEventListener('click', () => this.OnclickToggleDisabled()))
    }

    public printScore = () => {
		throw new Error("Method not implemented.");
    }
}