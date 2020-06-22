	.section	__TEXT,__text,regular,pure_instructions
	.macosx_version_min 10, 13
	.globl	_makeCharNode           ## -- Begin function makeCharNode
	.p2align	4, 0x90
_makeCharNode:                          ## @makeCharNode
	.cfi_startproc
## %bb.0:
	pushq	%rbp
	.cfi_def_cfa_offset 16
	.cfi_offset %rbp, -16
	movq	%rsp, %rbp
	.cfi_def_cfa_register %rbp
	subq	$32, %rsp
	movb	%dil, -1(%rbp)
	movq	%rsi, -24(%rbp)
	movl	$16, %edi
	callq	_malloc
	movq	%rax, -16(%rbp)
	movb	-1(%rbp), %al
	movq	-16(%rbp), %rcx
	movb	%al, (%rcx)
	movq	-24(%rbp), %rax
	movq	-16(%rbp), %rcx
	movq	%rax, 8(%rcx)
	movq	-16(%rbp), %rax
	addq	$32, %rsp
	popq	%rbp
	retq
	.cfi_endproc
                                        ## -- End function
	.globl	_main                   ## -- Begin function main
	.p2align	4, 0x90
_main:                                  ## @main
	.cfi_startproc
## %bb.0:
	pushq	%rbp
	.cfi_def_cfa_offset 16
	.cfi_offset %rbp, -16
	movq	%rsp, %rbp
	.cfi_def_cfa_register %rbp
	pushq	%rbx
	subq	$552, %rsp              ## imm = 0x228
	.cfi_offset %rbx, -24
	leaq	-528(%rbp), %rbx
	movq	___stack_chk_guard@GOTPCREL(%rip), %rax
	movq	(%rax), %rax
	movq	%rax, -16(%rbp)
	movl	$0, -540(%rbp)
	movq	%rbx, %rdi
	leaq	l___const.main.message1(%rip), %rsi
	movl	$512, %edx              ## imm = 0x200
	callq	_memcpy
	movq	%rbx, %rdi
	callq	_strlen
	movl	%eax, -536(%rbp)
	movslq	-536(%rbp), %rdi
	shlq	$0, %rdi
	callq	_malloc
	movq	%rax, -552(%rbp)
	movl	-536(%rbp), %eax
	movl	%eax, -532(%rbp)
LBB1_1:                                 ## =>This Inner Loop Header: Depth=1
	cmpl	$0, -532(%rbp)
	jl	LBB1_4
## %bb.2:                               ##   in Loop: Header=BB1_1 Depth=1
	movl	-536(%rbp), %eax
	subl	-532(%rbp), %eax
	cltq
	movb	-528(%rbp,%rax), %al
	movq	-552(%rbp), %rcx
	movslq	-532(%rbp), %rdx
	movb	%al, (%rcx,%rdx)
## %bb.3:                               ##   in Loop: Header=BB1_1 Depth=1
	movl	-532(%rbp), %eax
	addl	$-1, %eax
	movl	%eax, -532(%rbp)
	jmp	LBB1_1
LBB1_4:
	movl	$33, %edi
	xorl	%esi, %esi
	callq	_makeCharNode
	movl	$100, %edi
	movq	%rax, %rsi
	callq	_makeCharNode
	movl	$108, %edi
	movq	%rax, %rsi
	callq	_makeCharNode
	movl	$114, %edi
	movq	%rax, %rsi
	callq	_makeCharNode
	movl	$111, %edi
	movq	%rax, %rsi
	callq	_makeCharNode
	movl	$119, %edi
	movq	%rax, %rsi
	callq	_makeCharNode
	movl	$32, %edi
	movq	%rax, %rsi
	callq	_makeCharNode
	movl	$111, %edi
	movq	%rax, %rsi
	callq	_makeCharNode
	movl	$108, %edi
	movq	%rax, %rsi
	callq	_makeCharNode
	movl	$108, %edi
	movq	%rax, %rsi
	callq	_makeCharNode
	movl	$101, %edi
	movq	%rax, %rsi
	callq	_makeCharNode
	movl	$72, %edi
	movq	%rax, %rsi
	callq	_makeCharNode
	movq	%rax, -560(%rbp)
	movl	-540(%rbp), %eax
	movq	-16(%rbp), %rcx
	movq	___stack_chk_guard@GOTPCREL(%rip), %rdx
	movq	(%rdx), %rdx
	subq	%rcx, %rdx
	jne	LBB1_5
	jmp	LBB1_6
LBB1_5:
	callq	___stack_chk_fail
LBB1_6:
	addq	$552, %rsp              ## imm = 0x228
	popq	%rbx
	popq	%rbp
	retq
	.cfi_endproc
                                        ## -- End function
	.section	__TEXT,__const
	.p2align	4               ## @__const.main.message1
l___const.main.message1:
	.asciz	"Hello, world!\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000"

.subsections_via_symbols
